import type { ProviderAdapter, ProviderDefinition } from "../types";

/** Represents a provider on the roadmap with no live or demo integration. */
export function createNotConnectedAdapter(definition: ProviderDefinition): ProviderAdapter {
  return {
    definition: { ...definition, connected: false },
    async submit(request) {
      return {
        providerId: definition.id,
        status: "NOT_CONNECTED",
        receivedAt: request.submittedAt,
        attempt: request.attempt,
        source: definition.integration,
        journey: [
          {
            status: "NOT_CONNECTED",
            offsetMs: 0,
            note: "No integration configured. Application was not sent to this provider.",
          },
        ],
      };
    },
  };
}
