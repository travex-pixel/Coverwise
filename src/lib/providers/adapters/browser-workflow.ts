import type { ProviderAdapter, ProviderDefinition, ProviderResult, QuoteRequest } from "../types";

/* ------------------------------------------------------------------
   Contractually approved browser workflow adapter.

   Browser automation (Playwright) must run in a dedicated worker, not
   inside a serverless request. This adapter forwards the standardised
   application to that worker over HTTPS and normalises its response.

   Hard rules, enforced by policy and by the worker:
   - Only providers with a written agreement permitting automation.
   - Never bypass CAPTCHA, identity verification, rate limits or any
     anti-automation control. If one is encountered the workflow stops
     and the result is MANUAL_ACTION_REQUIRED.
   - Customer data is sent only after explicit consent is recorded.

   Without BROWSER_WORKFLOW_WORKER_URL configured, this adapter reports
   NOT_CONNECTED and sends nothing anywhere.
------------------------------------------------------------------- */

interface WorkerResponse {
  status: ProviderResult["status"];
  quote?: ProviderResult["quote"];
  referral?: ProviderResult["referral"];
  decline?: ProviderResult["decline"];
  manualAction?: ProviderResult["manualAction"];
  journey?: ProviderResult["journey"];
}

export function createBrowserWorkflowAdapter(definition: ProviderDefinition): ProviderAdapter {
  const workerUrl = process.env.BROWSER_WORKFLOW_WORKER_URL;
  const workerToken = process.env.BROWSER_WORKFLOW_WORKER_TOKEN;
  const connected = Boolean(workerUrl && workerToken);

  return {
    definition: { ...definition, connected },
    async submit(request: QuoteRequest): Promise<ProviderResult> {
      const base = {
        providerId: definition.id,
        receivedAt: new Date().toISOString(),
        attempt: request.attempt,
        source: definition.integration,
      } as const;

      if (!connected) {
        return {
          ...base,
          status: "NOT_CONNECTED",
          journey: [
            {
              status: "NOT_CONNECTED",
              offsetMs: 0,
              note: "Browser workflow worker not configured. Nothing was sent.",
            },
          ],
        };
      }

      try {
        const res = await fetch(`${workerUrl}/workflows/${definition.id}/quote`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${workerToken}`,
          },
          body: JSON.stringify({
            comparisonId: request.comparisonId,
            application: request.application,
          }),
          signal: AbortSignal.timeout(120_000),
        });
        if (!res.ok) throw new Error(`Worker responded ${res.status}`);
        const data = (await res.json()) as WorkerResponse;
        return {
          ...base,
          receivedAt: new Date().toISOString(),
          status: data.status,
          quote: data.quote,
          referral: data.referral,
          decline: data.decline,
          manualAction: data.manualAction,
          journey: data.journey ?? [{ status: data.status, offsetMs: 0 }],
        };
      } catch (err) {
        return {
          ...base,
          status: "ERROR",
          error: {
            message: err instanceof Error ? err.message : "Workflow worker unavailable",
            retryable: true,
          },
          journey: [
            { status: "SUBMITTED", offsetMs: 0 },
            { status: "ERROR", offsetMs: 0, note: "Workflow worker unavailable" },
          ],
        };
      }
    },
  };
}
