import type { Application } from "@/lib/application/schema";

/* ------------------------------------------------------------------
   Provider adapter contract.

   Every insurer, broker or workflow integration implements this
   interface. The orchestrator fans one standardised application out to
   every adapter and normalises what comes back, so the customer only
   ever enters their details once.
------------------------------------------------------------------- */

export const PROVIDER_STATUSES = [
  "NOT_CONNECTED",
  "READY",
  "SUBMITTED",
  "QUOTING",
  "QUOTED",
  "REFERRED",
  "DECLINED",
  "ERROR",
  "MANUAL_ACTION_REQUIRED",
] as const;
export type ProviderStatus = (typeof PROVIDER_STATUSES)[number];

export type IntegrationMethod =
  | "insurer_api"
  | "broker_api"
  | "browser_workflow"
  | "manual_referral";

export const INTEGRATION_LABELS: Record<IntegrationMethod, string> = {
  insurer_api: "Insurer API",
  broker_api: "Authorised broker",
  browser_workflow: "Approved browser workflow",
  manual_referral: "Human-assisted referral",
};

export interface ProviderDefinition {
  id: string;
  name: string;
  /** Underwriting entity, where known. */
  underwriter?: string;
  integration: IntegrationMethod;
  /** True when a live integration is configured for this environment. */
  connected: boolean;
  /** Whether results from this adapter are synthetic demonstration data. */
  demo: boolean;
  tagline: string;
  /** Short, plain-English description of what the integration does. */
  integrationNote: string;
  /** Visual accent for the provider mark (hue in degrees). */
  accentHue: number;
  monogram: string;
}

export interface QuoteRequest {
  comparisonId: string;
  submittedAt: string;
  application: Application;
  /** 1 for the first submission, incremented on retry. */
  attempt: number;
}

export interface JourneyEvent {
  status: ProviderStatus;
  /** Milliseconds after submission that the status was reached. */
  offsetMs: number;
  note?: string;
}

export interface QuoteExtras {
  choiceOfRepairer: "included" | "optional" | "unavailable";
  hireCar: "included" | "optional" | "unavailable";
  windscreen: "included" | "optional" | "unavailable";
  roadside: "included" | "optional" | "unavailable";
}

export interface Quote {
  reference: string;
  annualPremium: number;
  monthlyPremium?: number;
  excess: number;
  valuation: "agreed" | "market";
  agreedValue?: number;
  inclusions: string[];
  exclusions: string[];
  extras: QuoteExtras;
  /** 0–100 coverage breadth score computed by Coverwise, not the insurer. */
  coverageScore: number;
  validUntil: string;
  /** Plain-language notes the customer should know. */
  notes?: string[];
}

export interface ProviderResult {
  providerId: string;
  status: ProviderStatus;
  receivedAt: string;
  attempt: number;
  source: IntegrationMethod;
  quote?: Quote;
  referral?: { reason: string; nextStep: string; expectedWithin: string };
  decline?: { reason: string };
  error?: { message: string; retryable: boolean };
  manualAction?: { reason: string; instruction: string };
  journey: JourneyEvent[];
}

export interface ProviderAdapter {
  readonly definition: ProviderDefinition;
  submit(request: QuoteRequest): Promise<ProviderResult>;
}

export const STATUS_LABELS: Record<ProviderStatus, string> = {
  NOT_CONNECTED: "Not yet connected",
  READY: "Ready",
  SUBMITTED: "Submitted",
  QUOTING: "Quoting",
  QUOTED: "Quote returned",
  REFERRED: "Referred to underwriter",
  DECLINED: "Declined",
  ERROR: "No response",
  MANUAL_ACTION_REQUIRED: "Action required",
};
