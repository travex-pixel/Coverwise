import { isDemoMode } from "@/lib/mode";
import { createBrowserWorkflowAdapter } from "./adapters/browser-workflow";
import { createDemoInsurerAdapter, type DemoPersonality } from "./adapters/demo-insurer";
import { createNotConnectedAdapter } from "./adapters/not-connected";
import type { ProviderAdapter, ProviderDefinition } from "./types";

/* ------------------------------------------------------------------
   Provider registry.

   All providers below are FICTIONAL demonstration brands. They do not
   represent any real insurer, and no commercial relationship is implied.
   Each exercises a different state of the quote journey so the
   comparison experience is honest about what happened.
------------------------------------------------------------------- */

export const PROVIDER_DEFINITIONS: Record<string, ProviderDefinition> = {
  harbourline: {
    id: "harbourline",
    name: "Harbourline",
    underwriter: "Harbourline General Insurance Ltd",
    integration: "insurer_api",
    connected: true,
    demo: true,
    tagline: "Balanced cover, well-priced",
    integrationNote: "Structured quote API. Responds in seconds.",
    accentHue: 205,
    monogram: "H",
  },
  kestrel: {
    id: "kestrel",
    name: "Kestrel Mutual",
    underwriter: "Kestrel Mutual Ltd",
    integration: "insurer_api",
    connected: true,
    demo: true,
    tagline: "Lean cover at a lean price",
    integrationNote: "Structured quote API. Market value only.",
    accentHue: 28,
    monogram: "K",
  },
  banksia: {
    id: "banksia",
    name: "Banksia Cover",
    underwriter: "Banksia Insurance Australia Ltd",
    integration: "insurer_api",
    connected: true,
    demo: true,
    tagline: "Everything included, priced accordingly",
    integrationNote: "Structured quote API with full benefit schedule.",
    accentHue: 345,
    monogram: "B",
  },
  northgate: {
    id: "northgate",
    name: "Northgate & Pryor",
    underwriter: "Panel of underwriters via broker",
    integration: "broker_api",
    connected: true,
    demo: true,
    tagline: "Broker-placed cover from a panel",
    integrationNote: "Authorised broker integration. Slower, returns the broker's best panel offer.",
    accentHue: 262,
    monogram: "N",
  },
  wattle: {
    id: "wattle",
    name: "Wattle & Co",
    underwriter: "Wattle & Co Insurance Ltd",
    integration: "insurer_api",
    connected: true,
    demo: true,
    tagline: "Solid cover, occasionally slow",
    integrationNote: "Structured quote API. Demonstrates a timed-out response and retry.",
    accentHue: 48,
    monogram: "W",
  },
  fairlight: {
    id: "fairlight",
    name: "Fairlight Assure",
    underwriter: "Fairlight Assure Pty Ltd",
    integration: "manual_referral",
    connected: true,
    demo: true,
    tagline: "Every application reviewed by a person",
    integrationNote: "Human-assisted referral. An underwriter reviews and replies within one business day.",
    accentHue: 160,
    monogram: "F",
  },
  ironbark: {
    id: "ironbark",
    name: "Ironbark Direct",
    underwriter: "Ironbark Direct Insurance Ltd",
    integration: "insurer_api",
    connected: true,
    demo: true,
    tagline: "Specialist in vehicles three years and older",
    integrationNote: "Structured quote API. Declines outside its underwriting appetite.",
    accentHue: 10,
    monogram: "I",
  },
  pelorus: {
    id: "pelorus",
    name: "Pelorus Insurance",
    underwriter: "Pelorus Insurance Ltd",
    integration: "browser_workflow",
    connected: true,
    demo: true,
    tagline: "Quotes via approved browser workflow",
    integrationNote:
      "Contractually approved browser workflow. Stops at the provider's identity check and hands over to you.",
    accentHue: 190,
    monogram: "P",
  },
  southbank: {
    id: "southbank",
    name: "Southbank General",
    underwriter: "Southbank General Insurance Ltd",
    integration: "insurer_api",
    connected: false,
    demo: true,
    tagline: "Integration in progress",
    integrationNote: "Commercial agreement under discussion. Not yet receiving applications.",
    accentHue: 220,
    monogram: "S",
  },
  tallow: {
    id: "tallow",
    name: "Tallow Mutual",
    underwriter: "Tallow Mutual Ltd",
    integration: "broker_api",
    connected: false,
    demo: true,
    tagline: "On the roadmap",
    integrationNote: "Planned broker integration. Not yet receiving applications.",
    accentHue: 90,
    monogram: "T",
  },
};

const PERSONALITIES: Record<string, DemoPersonality> = {
  harbourline: {
    priceFactor: 1.0,
    excessPolicy: "honour",
    offersAgreedValue: true,
    inclusions: [
      "New car replacement if written off within 2 years",
      "Personal effects up to $500",
      "Emergency repairs up to $500",
      "Towing and storage after an incident",
      "Replacement keys and locks up to $1,000",
    ],
    exclusions: ["Ride-share or delivery use", "Racing, track days and timed events"],
    extras: { choiceOfRepairer: "optional", hireCar: "optional", windscreen: "optional", roadside: "unavailable" },
    extraPricing: { choiceOfRepairer: 85, hireCar: 120, windscreen: 65 },
    monthlyLoading: 1.06,
    validityDays: 30,
    latencyMs: [1800, 2600],
    outcome: () => ({ kind: "quoted" }),
  },
  kestrel: {
    priceFactor: 0.84,
    excessPolicy: "minimum-1000",
    offersAgreedValue: false,
    inclusions: ["Towing after an incident", "Emergency repairs up to $300", "Replacement keys up to $500"],
    exclusions: [
      "No new car replacement",
      "Personal effects not covered",
      "Additional $800 excess for drivers under 25",
    ],
    extras: { choiceOfRepairer: "unavailable", hireCar: "optional", windscreen: "optional", roadside: "optional" },
    extraPricing: { hireCar: 140, windscreen: 70, roadside: 95 },
    monthlyLoading: 1.1,
    validityDays: 14,
    latencyMs: [900, 1400],
    outcome: () => ({ kind: "quoted" }),
    notes: (app) =>
      app.cover.valuation === "agreed" ? ["Kestrel offers market value only; your agreed value preference could not be met."] : [],
  },
  banksia: {
    priceFactor: 1.24,
    excessPolicy: "honour",
    offersAgreedValue: true,
    inclusions: [
      "New car replacement if written off within 3 years",
      "Hire car after any incident, up to 21 days",
      "Personal effects up to $1,000",
      "Child seats and baby capsules",
      "Emergency accommodation and travel up to $1,500",
      "Lifetime guarantee on authorised repairs",
      "Replacement keys and locks up to $2,000",
    ],
    exclusions: ["Racing, track days and timed events"],
    extras: { choiceOfRepairer: "included", hireCar: "included", windscreen: "included", roadside: "optional" },
    extraPricing: { roadside: 89 },
    monthlyLoading: 1.0,
    validityDays: 30,
    latencyMs: [2400, 3400],
    outcome: () => ({ kind: "quoted" }),
  },
  northgate: {
    priceFactor: 0.95,
    excessPolicy: "minimum-750",
    offersAgreedValue: true,
    inclusions: [
      "New car replacement if written off within 2 years",
      "Personal effects up to $750",
      "Towing and storage after an incident",
      "Trailer and caravan liability",
    ],
    exclusions: ["Business use beyond commuting", "Vehicles with performance modifications"],
    extras: { choiceOfRepairer: "optional", hireCar: "optional", windscreen: "included", roadside: "optional" },
    extraPricing: { choiceOfRepairer: 60, hireCar: 110, roadside: 80 },
    monthlyLoading: 1.05,
    validityDays: 21,
    latencyMs: [2800, 4200],
    outcome: (app) =>
      app.vehicle.modifications === "performance"
        ? { kind: "declined", reason: "Panel underwriters exclude vehicles with performance modifications." }
        : { kind: "quoted" },
  },
  wattle: {
    priceFactor: 1.02,
    excessPolicy: "honour",
    offersAgreedValue: true,
    inclusions: [
      "New car replacement if written off within 2 years",
      "Personal effects up to $500",
      "Emergency repairs up to $800",
      "Towing and storage after an incident",
    ],
    exclusions: ["Ride-share or delivery use"],
    extras: { choiceOfRepairer: "optional", hireCar: "optional", windscreen: "optional", roadside: "optional" },
    extraPricing: { choiceOfRepairer: 75, hireCar: 125, windscreen: 60, roadside: 85 },
    monthlyLoading: 1.08,
    validityDays: 30,
    latencyMs: [3200, 4000],
    outcome: (_app, attempt) =>
      attempt === 1
        ? { kind: "error", message: "Provider did not respond within 30 seconds.", retryable: true }
        : { kind: "quoted" },
  },
  fairlight: {
    priceFactor: 1.0,
    excessPolicy: "honour",
    offersAgreedValue: true,
    inclusions: [],
    exclusions: [],
    extras: { choiceOfRepairer: "optional", hireCar: "optional", windscreen: "optional", roadside: "optional" },
    extraPricing: {},
    monthlyLoading: null,
    validityDays: 30,
    latencyMs: [1200, 1800],
    outcome: () => ({
      kind: "referred",
      reason: "Fairlight prices every application through its underwriting desk.",
      nextStep: "An underwriter reviews your standardised application and sends terms to Coverwise.",
      expectedWithin: "1 business day",
    }),
  },
  ironbark: {
    priceFactor: 0.9,
    excessPolicy: "honour",
    offersAgreedValue: false,
    inclusions: ["Towing after an incident", "Emergency repairs up to $500", "Personal effects up to $300"],
    exclusions: ["No new car replacement", "Vehicles under 3 years old"],
    extras: { choiceOfRepairer: "optional", hireCar: "optional", windscreen: "optional", roadside: "unavailable" },
    extraPricing: { choiceOfRepairer: 70, hireCar: 115, windscreen: 55 },
    monthlyLoading: 1.07,
    validityDays: 30,
    latencyMs: [1000, 1600],
    outcome: (app, _attempt, asOf) => {
      const age = asOf.getFullYear() - app.vehicle.year;
      if (age < 3) {
        return {
          kind: "declined",
          reason: `Outside underwriting appetite: Ironbark insures vehicles three years and older (yours is ${age === 0 ? "new" : `${age} year${age === 1 ? "" : "s"} old`}).`,
        };
      }
      if (app.driver.age < 25) {
        return { kind: "declined", reason: "Outside underwriting appetite: drivers under 25." };
      }
      return { kind: "quoted" };
    },
  },
  pelorus: {
    priceFactor: 0.97,
    excessPolicy: "honour",
    offersAgreedValue: true,
    inclusions: [],
    exclusions: [],
    extras: { choiceOfRepairer: "optional", hireCar: "optional", windscreen: "optional", roadside: "optional" },
    extraPricing: {},
    monthlyLoading: null,
    validityDays: 14,
    latencyMs: [3600, 4600],
    outcome: () => ({
      kind: "manual",
      reason: "Pelorus requires you to verify your identity on its own site before it releases a price.",
      instruction:
        "The approved workflow pre-filled your application and paused at the identity check. Coverwise never bypasses verification steps — you complete that step yourself, then the quote is captured.",
    }),
  },
};

/** Build the adapter list for the current environment. */
export function getProviderAdapters(): ProviderAdapter[] {
  const demo = isDemoMode();
  return Object.values(PROVIDER_DEFINITIONS).map((def) => {
    if (!def.connected) return createNotConnectedAdapter(def);
    if (demo) return createDemoInsurerAdapter(def, PERSONALITIES[def.id]);
    // Live mode: only wire adapters that have real credentials.
    if (def.integration === "browser_workflow") return createBrowserWorkflowAdapter(def);
    return createNotConnectedAdapter({ ...def, demo: false });
  });
}

export function getDemoPersonality(id: string): DemoPersonality {
  return PERSONALITIES[id];
}

export function getProviderDefinition(id: string) {
  return PROVIDER_DEFINITIONS[id];
}

export const PROVIDER_LIST = Object.values(PROVIDER_DEFINITIONS);
