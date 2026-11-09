import { DEMO_PROFILE } from "@/lib/application/demo-profile";
import { createDemoInsurerAdapter } from "@/lib/providers/adapters/demo-insurer";
import { PROVIDER_DEFINITIONS, getDemoPersonality } from "@/lib/providers/registry";
import type { ProviderResult } from "@/lib/providers/types";

/* Deterministic preview data for the landing page product mock. It runs the
   same demonstration adapters the product uses, against the anonymised
   demo profile, with a fixed timestamp so it can be prerendered. */

const FIXED_SUBMITTED_AT = "2026-11-09T22:00:00.000Z";

export async function getPreviewResults(): Promise<ProviderResult[]> {
  const ids = ["harbourline", "jarrah", "banksia", "sturt-hume", "fairlight", "ironbark"];
  const results = await Promise.all(
    ids.map((id) =>
      createDemoInsurerAdapter(PROVIDER_DEFINITIONS[id], getDemoPersonality(id)).submit({
        comparisonId: "preview",
        submittedAt: FIXED_SUBMITTED_AT,
        application: DEMO_PROFILE,
        attempt: 1,
      }),
    ),
  );
  return results;
}
