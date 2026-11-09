"use client";

import * as React from "react";
import { Hand, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProviderMark } from "@/components/ui/provider-mark";
import type { ComparisonRecord } from "@/lib/providers/orchestrator";
import { INTEGRATION_LABELS, type ProviderResult } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { JourneyTimeline } from "./quote-detail";
import { StatusBadge } from "./status-badge";

/* Every provider, every outcome: the auditable journey behind the quotes. */

const GROUPS: { title: string; statuses: ProviderResult["status"][]; blurb: string }[] = [
  { title: "Quotes returned", statuses: ["QUOTED"], blurb: "Priced and normalised." },
  { title: "Needs attention", statuses: ["REFERRED", "MANUAL_ACTION_REQUIRED", "ERROR"], blurb: "Awaiting a person, a step, or a retry." },
  { title: "Declined", statuses: ["DECLINED"], blurb: "Outside the provider's underwriting appetite." },
];

export function ProviderJourney({
  record,
  retry,
  retrying,
  onViewQuote,
}: {
  record: ComparisonRecord;
  retry: (providerId: string) => void;
  retrying: Set<string>;
  onViewQuote: (providerId: string) => void;
}) {
  const [manualFor, setManualFor] = React.useState<string | null>(null);
  const manual = manualFor ? record.results.find((r) => r.providerId === manualFor) : null;
  const manualDef = manual ? record.providers.find((p) => p.id === manual.providerId) : null;

  return (
    <div className="flex flex-col gap-4">
      {GROUPS.map((g) => {
        if (g.statuses.includes("NOT_CONNECTED")) return null;
        const items = record.results.filter((r) => g.statuses.includes(r.status));
        if (!items.length) return null;
        return (
          <section key={g.title}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">
                {g.title} <span className="ml-1 tabular text-muted-2/70">{items.length}</span>
              </h3>
              <p className="text-[11.5px] text-muted-2">{g.blurb}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {items.map((r) => {
                const def = record.providers.find((p) => p.id === r.providerId)!;
                const busy = retrying.has(r.providerId);
                return (
                  <li
                    key={r.providerId}
                    className={cn("surface-card rounded-[12px] px-3.5 py-3", r.status === "NOT_CONNECTED" && "border-dashed bg-transparent shadow-none")}
                  >
                    <div className="flex items-center gap-3">
                      <ProviderMark provider={def} size="md" className={cn(r.status === "NOT_CONNECTED" && "opacity-60 grayscale")} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-[14px] font-medium text-ink">{def.name}</p>
                          <StatusBadge status={busy ? "QUOTING" : r.status} />
                        </div>
                        <p className="mt-0.5 text-[12px] text-muted-2">{INTEGRATION_LABELS[def.integration]} · {def.integrationNote}</p>
                      </div>
                      {r.status === "QUOTED" && (
                        <Button variant="secondary" size="sm" onClick={() => onViewQuote(r.providerId)}>
                          View quote
                        </Button>
                      )}
                      {r.status === "ERROR" && r.error?.retryable && (
                        <Button variant="secondary" size="sm" loading={busy} onClick={() => retry(r.providerId)}>
                          {!busy && <RotateCw className="size-3.5" strokeWidth={2.25} aria-hidden />}
                          Retry
                        </Button>
                      )}
                      {r.status === "MANUAL_ACTION_REQUIRED" && (
                        <Button variant="secondary" size="sm" onClick={() => setManualFor(r.providerId)}>
                          <Hand className="size-3.5" strokeWidth={2.25} aria-hidden />
                          What&apos;s needed
                        </Button>
                      )}
                    </div>
                    {(r.referral || r.decline || r.error || r.manualAction) && (
                      <p className="mt-2 rounded-[10px] bg-ink/[0.035] px-3 py-2 text-[12.5px] leading-snug text-muted">
                        {r.referral && (
                          <>
                            <span className="font-medium text-ink">Referred.</span> {r.referral.reason} {r.referral.nextStep}{" "}
                            <span className="text-ink">Expected within {r.referral.expectedWithin}.</span>
                          </>
                        )}
                        {r.decline && (
                          <>
                            <span className="font-medium text-ink">Declined.</span> {r.decline.reason}
                          </>
                        )}
                        {r.error && (
                          <>
                            <span className="font-medium text-ink">No response.</span> {r.error.message}
                            {r.error.retryable ? " You can retry without re-entering anything." : ""}
                          </>
                        )}
                        {r.manualAction && (
                          <>
                            <span className="font-medium text-ink">Action required.</span> {r.manualAction.reason}
                          </>
                        )}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <NotConnectedSection record={record} />

      <Dialog open={Boolean(manual)} onOpenChange={(o) => !o && setManualFor(null)}>
        {manual && manualDef && (
          <DialogContent
            size="sm"
            title={`Finish with ${manualDef.name}`}
            description={manual.manualAction?.reason}
            footer={
              <div className="flex justify-end">
                <Button onClick={() => setManualFor(null)}>Understood</Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4">
              <p className="text-[13.5px] leading-snug text-ink">{manual.manualAction?.instruction}</p>
              <p className="rounded-[10px] bg-ink/[0.04] px-3 py-2 text-[12.5px] leading-snug text-muted">
                In this demonstration there is no provider site to visit. In production, this step opens the provider&apos;s
                verification page in a new tab and Coverwise captures the result once you&apos;re done.
              </p>
              <JourneyTimeline result={manual} submittedAt={record.createdAt} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function NotConnectedSection({ record }: { record: ComparisonRecord }) {
  const items = record.results.filter((r) => r.status === "NOT_CONNECTED");
  if (!items.length) return null;
  return (
    <section>
      <div className="mb-1.5 flex items-baseline justify-between">
        <h3 className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">
          Not yet connected <span className="ml-1 tabular text-muted-2/70">{items.length}</span>
        </h3>
        <p className="text-[11.5px] text-muted-2">Nothing was sent.</p>
      </div>
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {items.map((r) => {
          const def = record.providers.find((p) => p.id === r.providerId)!;
          return (
            <li key={r.providerId} className="flex items-center gap-2 rounded-[10px] border border-dashed border-line-strong px-2.5 py-2">
              <ProviderMark provider={def} size="sm" className="grayscale opacity-70" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-muted">{def.name}</p>
                <p className="truncate text-[11px] text-muted-2">{def.underwriter}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11.5px] leading-snug text-muted-2">
        Market coverage targets only. No relationship implied, nothing sent until an authorised integration exists.
      </p>
    </section>
  );
}
