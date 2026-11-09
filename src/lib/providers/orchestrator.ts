import type { Application, Consent } from "@/lib/application/schema";
import { getMode, type CoverwiseMode } from "@/lib/mode";
import { getProviderAdapters } from "./registry";
import type { ProviderDefinition, ProviderResult, QuoteRequest } from "./types";

export interface ComparisonRecord {
  id: string;
  createdAt: string;
  mode: CoverwiseMode;
  application: Application;
  consent: Consent & { providersShared: string[] };
  providers: ProviderDefinition[];
  results: ProviderResult[];
}

/** Fan the standardised application out to every adapter and normalise the results. */
export async function runComparison(input: {
  id: string;
  application: Application;
  consent: Consent;
}): Promise<ComparisonRecord> {
  const adapters = getProviderAdapters();
  const submittedAt = new Date().toISOString();
  const request: QuoteRequest = {
    comparisonId: input.id,
    submittedAt,
    application: input.application,
    attempt: 1,
  };

  const settled = await Promise.allSettled(adapters.map((a) => a.submit(request)));
  const results: ProviderResult[] = settled.map((outcome, i) => {
    const def = adapters[i].definition;
    if (outcome.status === "fulfilled") return outcome.value;
    return {
      providerId: def.id,
      status: "ERROR",
      receivedAt: new Date().toISOString(),
      attempt: 1,
      source: def.integration,
      error: { message: "Adapter threw an unexpected error.", retryable: true },
      journey: [
        { status: "SUBMITTED", offsetMs: 0 },
        { status: "ERROR", offsetMs: 0, note: "Adapter threw an unexpected error." },
      ],
    };
  });

  const providersShared = adapters.filter((a) => a.definition.connected).map((a) => a.definition.id);

  return {
    id: input.id,
    createdAt: submittedAt,
    mode: getMode(),
    application: input.application,
    consent: { ...input.consent, providersShared },
    providers: adapters.map((a) => a.definition),
    results,
  };
}

/** Re-submit to a single provider (used for retryable errors). */
export async function retryProvider(input: {
  comparisonId: string;
  providerId: string;
  application: Application;
  attempt: number;
}): Promise<ProviderResult | null> {
  const adapter = getProviderAdapters().find((a) => a.definition.id === input.providerId);
  if (!adapter) return null;
  return adapter.submit({
    comparisonId: input.comparisonId,
    submittedAt: new Date().toISOString(),
    application: input.application,
    attempt: input.attempt,
  });
}
