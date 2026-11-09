"use client";

import { Check, Minus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CoverageMeter } from "@/components/ui/coverage-meter";
import { ProviderMark } from "@/components/ui/provider-mark";
import { EXTRA_LABELS } from "@/lib/application/labels";
import { formatAud, formatAudCents, formatDate, formatTime } from "@/lib/format";
import { INTEGRATION_LABELS, type ProviderDefinition, type ProviderResult, type Quote } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-line bg-white/70 px-3 py-2.5">
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-2">{label}</p>
      <p className="mt-1 text-[17px] font-medium tabular leading-none tracking-[-0.02em] text-ink">{value}</p>
      {sub && <p className="mt-1 text-[11.5px] text-muted">{sub}</p>}
    </div>
  );
}

export function QuoteDetail({
  provider,
  result,
  quote,
  submittedAt,
}: {
  provider: ProviderDefinition;
  result: ProviderResult;
  quote: Quote;
  submittedAt: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <ProviderMark provider={provider} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-medium tracking-[-0.015em]">{provider.name}</p>
          {provider.underwriter && <p className="text-[12.5px] text-muted">Underwritten by {provider.underwriter}</p>}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <StatusBadge status={result.status} />
            <Badge size="sm" tone="neutral">
              {INTEGRATION_LABELS[result.source]}
            </Badge>
            {provider.demo && (
              <Badge size="sm" tone="champagne">
                Demo adapter
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-champagne-2/40 bg-champagne/15 px-3 py-2 text-[12px] leading-snug text-ink">
        Illustrative demonstration. Not an insurer quote.
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Stat
          label="Annual premium"
          value={formatAud(quote.annualPremium)}
          sub={quote.monthlyPremium ? `or ${formatAudCents(quote.monthlyPremium)} monthly` : "Annual payment only"}
        />
        <Stat label="Excess" value={formatAud(quote.excess)} sub="Standard excess per claim" />
        <Stat
          label="Valuation"
          value={quote.valuation === "agreed" ? "Agreed" : "Market"}
          sub={quote.valuation === "agreed" && quote.agreedValue ? `Agreed at ${formatAud(quote.agreedValue)}` : "Value at time of loss"}
        />
        <Stat label="Coverage breadth" value={<CoverageMeter score={quote.coverageScore} />} sub="Coverwise score, not the insurer's" />
      </div>

      <section>
        <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Optional extras</h3>
        <ul className="divide-y divide-line rounded-[12px] border border-line bg-white/70">
          {(Object.keys(quote.extras) as (keyof Quote["extras"])[]).map((k) => {
            const v = quote.extras[k];
            return (
              <li key={k} className="flex items-center justify-between gap-3 px-3 py-2 text-[13px]">
                <span>{EXTRA_LABELS[k]}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[12px] font-medium",
                    v === "included" ? "text-success" : v === "optional" ? "text-muted" : "text-muted-2",
                  )}
                >
                  {v === "included" ? <Check className="size-3.5" strokeWidth={2.5} /> : v === "optional" ? <Minus className="size-3.5" strokeWidth={2.5} /> : <X className="size-3.5" strokeWidth={2.5} />}
                  {v === "included" ? "Included" : v === "optional" ? "Available" : "Not offered"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {quote.inclusions.length > 0 && (
        <section>
          <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Important inclusions</h3>
          <ul className="flex flex-col gap-1.5 text-[13px] leading-snug">
            {quote.inclusions.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                {i}
              </li>
            ))}
          </ul>
        </section>
      )}

      {quote.exclusions.length > 0 && (
        <section>
          <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Important exclusions and limits</h3>
          <ul className="flex flex-col gap-1.5 text-[13px] leading-snug">
            {quote.exclusions.map((i) => (
              <li key={i} className="flex items-start gap-2">
                <X className="mt-0.5 size-3.5 shrink-0 text-danger" strokeWidth={2.5} aria-hidden />
                {i}
              </li>
            ))}
          </ul>
        </section>
      )}

      {quote.notes?.length ? (
        <section className="rounded-[12px] bg-ink/[0.04] px-3 py-2.5 text-[12.5px] leading-snug text-muted">
          {quote.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </section>
      ) : null}

      <section>
        <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Provenance</h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12.5px]">
          <dt className="text-muted">Reference</dt>
          <dd className="text-right font-mono text-ink">{quote.reference}</dd>
          <dt className="text-muted">Source</dt>
          <dd className="text-right text-ink">{INTEGRATION_LABELS[result.source]}{provider.demo ? " (demonstration)" : ""}</dd>
          <dt className="text-muted">Received</dt>
          <dd className="text-right tabular text-ink">{formatTime(result.receivedAt)}, {formatDate(result.receivedAt)}</dd>
          <dt className="text-muted">Valid until</dt>
          <dd className="text-right tabular text-ink">{formatDate(quote.validUntil)}</dd>
          <dt className="text-muted">Attempt</dt>
          <dd className="text-right tabular text-ink">{result.attempt}</dd>
        </dl>
      </section>

      <JourneyTimeline result={result} submittedAt={submittedAt} />
    </div>
  );
}

export function JourneyTimeline({ result, submittedAt }: { result: ProviderResult; submittedAt: string }) {
  const base = new Date(submittedAt).getTime();
  return (
    <section>
      <h3 className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Quote journey</h3>
      <ol className="relative ml-1.5 flex flex-col gap-2.5 border-l border-line pl-4">
        {result.journey.map((e, i) => (
          <li key={i} className="relative text-[12.5px] leading-snug">
            <span
              className={cn(
                "absolute -left-[21px] top-1 size-2.5 rounded-full border-2 border-paper",
                i === result.journey.length - 1 ? "bg-forest" : "bg-line-strong",
              )}
              aria-hidden
            />
            <p className="font-medium text-ink">
              {e.status.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase())}
              <span className="ml-2 font-mono text-[11px] font-normal text-muted-2">
                +{(e.offsetMs / 1000).toFixed(1)}s · {formatTime(new Date(base + e.offsetMs).toISOString())}
              </span>
            </p>
            {e.note && <p className="text-muted">{e.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
