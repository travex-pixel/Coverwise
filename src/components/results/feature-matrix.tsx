"use client";

import { Check, Minus, X } from "lucide-react";
import { ProviderMark } from "@/components/ui/provider-mark";
import { formatAud, formatAudCents, formatDate } from "@/lib/format";
import type { ProviderDefinition, Quote } from "@/lib/providers/types";
import { cn } from "@/lib/utils";

/* Side-by-side feature matrix: policy differences at a glance. */

type Item = { provider: ProviderDefinition; quote: Quote };

function Tri({ v }: { v: "included" | "optional" | "unavailable" | boolean }) {
  const state = v === true ? "included" : v === false ? "unavailable" : v;
  if (state === "included") return <Check className="mx-auto size-4 text-success" strokeWidth={2.5} aria-label="Included" />;
  if (state === "optional") return <Minus className="mx-auto size-4 text-muted" strokeWidth={2.5} aria-label="Available as an option" />;
  return <X className="mx-auto size-4 text-muted-2/70" strokeWidth={2.25} aria-label="Not offered" />;
}

export function FeatureMatrix({ items, onSelect, selectedId }: { items: Item[]; onSelect: (id: string) => void; selectedId?: string }) {
  const minPremium = Math.min(...items.map((i) => i.quote.annualPremium));
  const minExcess = Math.min(...items.map((i) => i.quote.excess));
  const maxScore = Math.max(...items.map((i) => i.quote.coverageScore));

  const rows: { label: string; render: (q: Quote) => React.ReactNode; group?: string }[] = [
    {
      label: "Annual premium",
      render: (q) => (
        <span className={cn("tabular font-medium", q.annualPremium === minPremium && "text-success")}>{formatAud(q.annualPremium)}</span>
      ),
    },
    { label: "Monthly", render: (q) => <span className="tabular">{q.monthlyPremium ? formatAudCents(q.monthlyPremium) : "—"}</span> },
    { label: "Excess", render: (q) => <span className={cn("tabular", q.excess === minExcess && "text-success font-medium")}>{formatAud(q.excess)}</span> },
    { label: "Valuation", render: (q) => (q.valuation === "agreed" ? `Agreed${q.agreedValue ? ` · ${formatAud(q.agreedValue)}` : ""}` : "Market") },
    { label: "Coverage score", render: (q) => <span className={cn("tabular", q.coverageScore === maxScore && "text-success font-medium")}>{q.coverageScore}/100</span> },
    { label: "Choice of repairer", render: (q) => <Tri v={q.extras.choiceOfRepairer} /> },
    { label: "Hire car", render: (q) => <Tri v={q.extras.hireCar} /> },
    { label: "Windscreen waiver", render: (q) => <Tri v={q.extras.windscreen} /> },
    { label: "Roadside", render: (q) => <Tri v={q.extras.roadside} /> },
    { label: "New car replacement", render: (q) => <Tri v={q.inclusions.some((i) => i.startsWith("New car"))} /> },
    { label: "Personal effects", render: (q) => <Tri v={q.inclusions.some((i) => i.startsWith("Personal effects"))} /> },
    { label: "Valid until", render: (q) => <span className="tabular">{formatDate(q.validUntil)}</span> },
  ];

  return (
    <div className="surface-card scrollbar-thin overflow-auto rounded-[14px]">
      <table className="w-full min-w-[520px] border-separate border-spacing-0 text-[13px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-[150px] bg-paper px-3.5 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-2">
              Feature
            </th>
            {items.map(({ provider }) => (
              <th key={provider.id} className="px-2 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onSelect(provider.id)}
                  className={cn(
                    "mx-auto flex flex-col items-center gap-1.5 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-ink/5",
                    selectedId === provider.id && "bg-forest/8",
                  )}
                >
                  <ProviderMark provider={provider} size="sm" />
                  <span className="max-w-[96px] truncate text-[12px] font-medium leading-tight text-ink">{provider.name}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={cn(i % 2 === 0 && "bg-ink/[0.025]")}>
              <th
                scope="row"
                className={cn("sticky left-0 z-10 px-3.5 py-2.5 text-left font-normal text-muted", i % 2 === 0 ? "bg-[#f6f5f0]" : "bg-paper")}
              >
                {row.label}
              </th>
              {items.map(({ provider, quote }) => (
                <td key={provider.id} className="px-2 py-2.5 text-center text-ink">
                  {row.render(quote)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3.5 py-2.5 text-[11.5px] text-muted-2">
        <Check className="mr-1 inline size-3 text-success" strokeWidth={2.5} /> included
        <Minus className="ml-3 mr-1 inline size-3 text-muted" strokeWidth={2.5} /> available as an option
        <X className="ml-3 mr-1 inline size-3 text-muted-2/70" strokeWidth={2.25} /> not offered
      </p>
    </div>
  );
}
