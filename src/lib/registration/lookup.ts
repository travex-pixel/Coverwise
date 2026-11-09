import type { AuState } from "@/lib/application/schema";

/* ------------------------------------------------------------------
   Registration lookup module.

   Australian registration-to-vehicle lookups are provided by state
   registries and licensed data vendors under commercial agreements.
   Coverwise ships the interface and a null provider so the UI can offer
   lookup the moment a licensed provider is configured, while being
   honest that no lookup service is connected today.
------------------------------------------------------------------- */

export interface RegistrationLookupRequest {
  registration: string;
  state: AuState;
}

export type RegistrationLookupResult =
  | {
      status: "found";
      vehicle: { make: string; model: string; year: number; variant?: string };
      source: string;
    }
  | { status: "not_found"; message: string }
  | { status: "not_connected"; message: string };

export interface RegistrationLookupProvider {
  readonly id: string;
  readonly connected: boolean;
  lookup(req: RegistrationLookupRequest): Promise<RegistrationLookupResult>;
}

export const nullLookupProvider: RegistrationLookupProvider = {
  id: "none",
  connected: false,
  async lookup() {
    return {
      status: "not_connected",
      message:
        "Registration lookup isn't connected yet. Enter your details below.",
    };
  },
};

/** Resolve the configured lookup provider. Extend here when a vendor is licensed. */
export function getRegistrationLookupProvider(): RegistrationLookupProvider {
  return nullLookupProvider;
}
