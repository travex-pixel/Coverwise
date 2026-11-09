"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ProviderMark } from "@/components/ui/provider-mark";
import type { ComparisonRecord } from "@/lib/providers/orchestrator";
import { INTEGRATION_LABELS, type ProviderStatus } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

/* Replays each provider's audited journey in real time, so the customer
   sees exactly what happened: who was contacted, who answered, who didn't. */

const TERMINAL: ProviderStatus[] = ["QUOTED", "REFERRED", "DECLINED", "ERROR", "MANUAL_ACTION_REQUIRED", "NOT_CONNECTED"];

export function Pipeline({ record, onDone }: { record: ComparisonRecord; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [elapsed, setElapsed] = React.useState(0);
  const start = React.useRef<number | null>(null);
  const maxOffset = React.useMemo(
    () => Math.max(0, ...record.results.flatMap((r) => r.journey.map((e) => e.offsetMs))),
    [record],
  );

  React.useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    let raf = 0;
    const tick = (t: number) => {
      start.current ??= t;
      const e = t - start.current;
      setElapsed(e);
      if (e < maxOffset + 700) raf = requestAnimationFrame(tick);
      else onDone();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [maxOffset, onDone, reduce]);

  const rows = record.results.map((r) => {
    const def = record.providers.find((p) => p.id === r.providerId)!;
    const reached = r.journey.filter((e) => e.offsetMs <= elapsed);
    const status: ProviderStatus = reached.length ? reached[reached.length - 1].status : "SUBMITTED";
    return { def, status, done: TERMINAL.includes(status) };
  });
  const active = rows.filter((r) => r.status !== "NOT_CONNECTED");
  const notConnected = rows.filter((r) => r.status === "NOT_CONNECTED");
  const responded = rows.filter((r) => r.done && r.status !== "NOT_CONNECTED").length;
  const contacted = rows.filter((r) => r.status !== "NOT_CONNECTED").length;

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="surface-showroom reflection flex max-h-full w-full max-w-[640px] flex-col rounded-(--radius-panel) p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ivory/50">Coordinating your comparison</p>
            <h1 className="mt-1 text-[22px] font-medium leading-tight tracking-[-0.02em] text-ivory sm:text-[26px]">
              One application, sent once.
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[26px] font-medium tabular leading-none tracking-[-0.03em] text-ivory">
              {responded}
              <span className="text-[14px] text-ivory/40"> / {contacted}</span>
            </p>
            <p className="mt-1 text-[11px] text-ivory/50">responded</p>
          </div>
        </div>

        <div className="relative mt-4 h-[3px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-champagne"
            animate={{ width: `${Math.min(100, (elapsed / (maxOffset + 400)) * 100)}%` }}
            transition={{ duration: 0.12, ease: "linear" }}
          />
        </div>

        <ol className="scrollbar-thin mt-4 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto">
          {active.map(({ def, status, done }) => (
            <li
              key={def.id}
              className={cn(
                "flex items-center gap-3 rounded-[12px] border border-white/8 px-3 py-2 transition-colors duration-(--dur)",
                done ? "bg-white/[0.06]" : "bg-white/[0.03]",
              )}
            >
              <ProviderMark provider={def} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ivory">{def.name}</p>
                <p className="truncate text-[11.5px] text-ivory/50">{INTEGRATION_LABELS[def.integration]}</p>
              </div>
              <StatusBadge status={status} dark />
            </li>
          ))}
          {notConnected.length > 0 && (
            <li className="flex items-center gap-3 rounded-[12px] border border-dashed border-white/12 px-3 py-2 opacity-70">
              <div className="flex -space-x-1.5">
                {notConnected.slice(0, 6).map(({ def }) => (
                  <ProviderMark key={def.id} provider={def} size="sm" className="size-6 rounded-[6px] text-[10px] ring-2 ring-[#15191a] grayscale" />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ivory/80">
                  {notConnected.length} Australian insurers not yet connected
                </p>
                <p className="truncate text-[11.5px] text-ivory/45">Nothing was sent to them.</p>
              </div>
              <StatusBadge status="NOT_CONNECTED" dark />
            </li>
          )}
        </ol>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] leading-snug text-ivory/40">
            Illustrative demonstration.
          </p>
          <Button variant="inverse" size="sm" onClick={onDone}>
            Show results
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
