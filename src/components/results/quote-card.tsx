"use client";

import { ChevronRight } from "lucide-react";
import { CoverageMeter } from "@/components/ui/coverage-meter";
import { ProviderMark } from "@/components/ui/provider-mark";
import { formatAud, formatAudCents } from "@/lib/format";
import type { ProviderDefinition, Quote } from "@/lib/providers/types";
import { cn } from "@/lib/utils";

export function QuoteCard({
  provider,
  quote,
  rank,
  highlight,
  selected,
  currentPremium,
  onSelect,
}: {
  provider: ProviderDefinition;
  quote: Quote;
  rank: number;
  highlight?: string;
  selected?: boolean;
  currentPremium?: number;
  onSelect: () => void;
}) {
  const delta = currentPremium ? quote.annualPremium - currentPremium : null;
  const included = (Object.entries(quote.extras) as [keyof Quote["extras"], string][])
    .filter(([, v]) => v === "included")
    .map(([k]) => k);
  const chips = [
    ...quote.inclusions.filter((i) => i.startsWith("New car")).map(() => "New car replacement"),
    ...included.map((k) => ({ choiceOfRepairer: "Choice of repairer", hireCar: "Hire car", windscreen: "Windscreen", roadside: "Roadside" })[k]),
  ].slice(0, 3);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group/card relative w-full rounded-[14px] border text-left transition-[border-color,box-shadow,background-color,transform] duration-(--dur-fast) ease-(--ease-out)",
        "active:scale-[0.995]",
        selected
          ? "border-forest/60 bg-white shadow-[0_0_0_1px_rgb(20_36_29/0.4),var(--shadow-card)]"
          : "surface-card hover:border-line-strong hover:shadow-float/50",
      )}
    >
      {highlight && (
        <span className="absolute -top-2.5 left-3.5 rounded-full border border-champagne-2/50 bg-champagne px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink shadow-[0_1px_2px_rgb(17_21_18/0.15)]">
          {highlight}
        </span>
      )}
      <div className="flex items-start gap-3 p-3.5 sm:p-4">
        <span className="mt-0.5 hidden w-4 text-[12px] tabular text-muted-2 sm:block">{rank}</span>
        <ProviderMark provider={provider} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-ink">{provider.name}</p>
              {provider.underwriter && (
                <p className="truncate text-[12px] text-muted-2">Underwritten by {provider.underwriter}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[20px] font-medium tabular leading-none tracking-[-0.025em] text-ink sm:text-[22px]">
                {formatAud(quote.annualPremium)}
                <span className="ml-0.5 text-[11.5px] font-normal text-muted-2">/yr</span>
              </p>
              <p className="mt-1 text-[11.5px] tabular text-muted-2">
                {quote.monthlyPremium ? `${formatAudCents(quote.monthlyPremium)}/mo` : "Annual payment only"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-muted">
            <span className="tabular">
              Excess <span className="font-medium text-ink">{formatAud(quote.excess)}</span>
            </span>
            <span className="text-line-strong">·</span>
            <span>
              {quote.valuation === "agreed" ? (
                <>
                  Agreed <span className="font-medium tabular text-ink">{quote.agreedValue ? formatAud(quote.agreedValue) : ""}</span>
                </>
              ) : (
                "Market value"
              )}
            </span>
            <span className="text-line-strong">·</span>
            <CoverageMeter score={quote.coverageScore} />
            {delta !== null && (
              <span
                className={cn(
                  "ml-auto rounded-full px-2 py-0.5 text-[11.5px] font-medium tabular",
                  delta < 0 ? "bg-success/10 text-success" : "bg-ink/6 text-muted",
                )}
              >
                {delta < 0 ? "−" : "+"}
                {formatAud(Math.abs(delta))} vs current
              </span>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            <ul className="flex min-w-0 flex-wrap gap-1.5">
              {chips.length ? (
                chips.map((c) => (
                  <li key={c} className="truncate rounded-[6px] bg-forest/8 px-2 py-0.5 text-[11.5px] font-medium text-forest">
                    {c}
                  </li>
                ))
              ) : (
                <li className="text-[11.5px] text-muted-2">Core cover only</li>
              )}
            </ul>
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[12.5px] font-medium text-forest">
              Details
              <ChevronRight className="size-3.5 transition-transform group-hover/card:translate-x-0.5" strokeWidth={2.25} aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
