import type { Application } from "@/lib/application/schema";
import {
  applicationFingerprint,
  computeBasePremium,
  hashString,
  seededUnit,
} from "@/lib/quotes/pricing";
import { coverageScore } from "@/lib/quotes/scoring";
import type {
  JourneyEvent,
  ProviderAdapter,
  ProviderDefinition,
  ProviderResult,
  ProviderStatus,
  Quote,
  QuoteExtras,
  QuoteRequest,
} from "../types";

/* ------------------------------------------------------------------
   Demonstration insurer adapter.

   Each fictional provider has a "personality": a pricing posture, an
   excess policy, a set of inclusions and an outcome rule. The adapter
   produces synthetic, clearly labelled results that exercise every
   provider state the real orchestrator must handle.

   Nothing here is an insurer quotation.
------------------------------------------------------------------- */

export type Outcome =
  | { kind: "quoted" }
  | { kind: "referred"; reason: string; nextStep: string; expectedWithin: string }
  | { kind: "declined"; reason: string }
  | { kind: "error"; message: string; retryable: boolean }
  | { kind: "manual"; reason: string; instruction: string };

export interface DemoPersonality {
  /** Multiplier against the Coverwise base premium (1 = neutral). */
  priceFactor: number;
  /** How the provider treats the customer's preferred excess. */
  excessPolicy: "honour" | "minimum-750" | "minimum-1000" | "plus-250";
  /** Whether the provider offers agreed value. */
  offersAgreedValue: boolean;
  inclusions: string[];
  exclusions: string[];
  extras: QuoteExtras;
  /** Cost of optional extras the customer asked for and the provider sells. */
  extraPricing: Partial<Record<keyof QuoteExtras, number>>;
  /** Monthly instalment loading (e.g. 1.08 = 8% more when paying monthly). */
  monthlyLoading: number | null;
  validityDays: number;
  /** Simulated response time range in milliseconds. */
  latencyMs: [number, number];
  outcome: (app: Application, attempt: number, asOf: Date) => Outcome;
  notes?: (app: Application) => string[];
}

function resolveExcess(preferred: number, policy: DemoPersonality["excessPolicy"]) {
  switch (policy) {
    case "honour":
      return preferred;
    case "minimum-750":
      return Math.max(750, preferred);
    case "minimum-1000":
      return Math.max(1000, preferred);
    case "plus-250":
      return preferred + 250;
  }
}

function buildQuote(def: ProviderDefinition, p: DemoPersonality, req: QuoteRequest): Quote {
  const { application: app } = req;
  const asOf = new Date(req.submittedAt);
  const pricing = computeBasePremium(app, asOf.getFullYear());
  const seed = `${def.id}|${applicationFingerprint(app)}`;
  const jitter = 0.97 + seededUnit(seed) * 0.06; // ±3%

  const excess = resolveExcess(app.cover.excess, p.excessPolicy);
  // Providers that force a higher excess give a small premium credit.
  const excessCredit = excess > app.cover.excess ? 1 - Math.min(0.08, (excess - app.cover.excess) / 6000) : 1;

  const valuation: Quote["valuation"] =
    app.cover.valuation === "agreed" && p.offersAgreedValue ? "agreed" : "market";

  let premium = pricing.premium * p.priceFactor * jitter * excessCredit;

  const extras: QuoteExtras = { ...p.extras };
  const requested = app.cover.extras;
  for (const key of Object.keys(requested) as (keyof QuoteExtras)[]) {
    if (requested[key] && extras[key] === "optional") {
      premium += p.extraPricing[key] ?? 0;
      extras[key] = "included";
    }
  }

  const annualPremium = Math.round(premium);
  const monthlyPremium = p.monthlyLoading
    ? Math.round(((annualPremium * p.monthlyLoading) / 12) * 100) / 100
    : undefined;

  const agreedValue =
    valuation === "agreed"
      ? Math.round((pricing.vehicleValue * (0.98 + seededUnit(seed + "av") * 0.06)) / 100) * 100
      : undefined;

  const validUntil = new Date(
    new Date(req.submittedAt).getTime() + p.validityDays * 86_400_000,
  ).toISOString();

  const ref = `${def.id.slice(0, 3).toUpperCase()}-${(hashString(seed) % 900000 + 100000).toString()}`;

  return {
    reference: ref,
    annualPremium,
    monthlyPremium,
    excess,
    valuation,
    agreedValue,
    inclusions: p.inclusions,
    exclusions: p.exclusions,
    extras,
    coverageScore: coverageScore({ valuation, excess, inclusions: p.inclusions, extras }),
    validUntil,
    notes: p.notes?.(app),
  };
}

function journeyFor(status: ProviderStatus, latency: number, note?: string): JourneyEvent[] {
  const events: JourneyEvent[] = [
    { status: "SUBMITTED", offsetMs: 0, note: "Standardised application sent" },
    { status: "QUOTING", offsetMs: Math.round(latency * 0.3), note: "Provider acknowledged, rating in progress" },
    { status, offsetMs: latency, note },
  ];
  return events;
}

export function createDemoInsurerAdapter(
  definition: ProviderDefinition,
  personality: DemoPersonality,
): ProviderAdapter {
  return {
    definition,
    async submit(request) {
      const seed = `${definition.id}|${request.comparisonId}|${request.attempt}`;
      const [lo, hi] = personality.latencyMs;
      const latency = Math.round(lo + seededUnit(seed + "lat") * (hi - lo));
      const outcome = personality.outcome(request.application, request.attempt, new Date(request.submittedAt));
      const base: Omit<ProviderResult, "status" | "journey"> = {
        providerId: definition.id,
        receivedAt: new Date(new Date(request.submittedAt).getTime() + latency).toISOString(),
        attempt: request.attempt,
        source: definition.integration,
      };

      switch (outcome.kind) {
        case "quoted":
          return {
            ...base,
            status: "QUOTED",
            quote: buildQuote(definition, personality, request),
            journey: journeyFor("QUOTED", latency, "Quote returned and normalised"),
          };
        case "referred":
          return {
            ...base,
            status: "REFERRED",
            referral: {
              reason: outcome.reason,
              nextStep: outcome.nextStep,
              expectedWithin: outcome.expectedWithin,
            },
            journey: journeyFor("REFERRED", latency, outcome.reason),
          };
        case "declined":
          return {
            ...base,
            status: "DECLINED",
            decline: { reason: outcome.reason },
            journey: journeyFor("DECLINED", latency, outcome.reason),
          };
        case "error":
          return {
            ...base,
            status: "ERROR",
            error: { message: outcome.message, retryable: outcome.retryable },
            journey: [
              { status: "SUBMITTED", offsetMs: 0, note: "Standardised application sent" },
              { status: "ERROR", offsetMs: latency, note: outcome.message },
            ],
          };
        case "manual":
          return {
            ...base,
            status: "MANUAL_ACTION_REQUIRED",
            manualAction: { reason: outcome.reason, instruction: outcome.instruction },
            journey: journeyFor("MANUAL_ACTION_REQUIRED", latency, outcome.reason),
          };
      }
    },
  };
}
