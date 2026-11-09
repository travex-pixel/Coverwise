"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProviderMark } from "@/components/ui/provider-mark";
import { PROVIDER_LIST } from "@/lib/providers/registry";
import { INTEGRATION_LABELS } from "@/lib/providers/types";

export function ProvidersDialog({ children }: { children: React.ReactNode }) {
  const connected = PROVIDER_LIST.filter((p) => p.connected);
  const roadmap = PROVIDER_LIST.filter((p) => !p.connected);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        title="Participating providers"
        description="Every provider below is a fictional demonstration brand. No real insurer is represented and no commercial relationship is implied."
        size="lg"
      >
        <div className="flex flex-col gap-5">
          <section>
            <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">
              Demonstration adapters
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {connected.map((p) => (
                <li key={p.id} className="surface-card flex items-start gap-3 rounded-[12px] p-3">
                  <ProviderMark provider={p} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[14px] font-medium">{p.name}</p>
                      <Badge size="sm" tone="neutral">
                        {INTEGRATION_LABELS[p.integration]}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{p.integrationNote}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">
              Not yet connected
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {roadmap.map((p) => (
                <li key={p.id} className="flex items-start gap-3 rounded-[12px] border border-dashed border-line-strong p-3">
                  <ProviderMark provider={p} className="opacity-60 grayscale" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-muted">{p.name}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-muted-2">{p.integrationNote}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <p className="text-[12.5px] leading-snug text-muted-2">
            The adapter architecture supports official insurer APIs, authorised broker integrations,
            contractually approved browser workflows and human-assisted referrals. Coverwise never bypasses
            CAPTCHA, identity checks or anti-automation controls.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
