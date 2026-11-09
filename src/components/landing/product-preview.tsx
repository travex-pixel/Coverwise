import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CoverageMeter } from "@/components/ui/coverage-meter";
import { ProviderMark } from "@/components/ui/provider-mark";
import { DEMO_PROFILE } from "@/lib/application/demo-profile";
import { vehicleTitle } from "@/lib/application/labels";
import { formatAud } from "@/lib/format";
import { PROVIDER_DEFINITIONS, PROVIDER_LIST } from "@/lib/providers/registry";
import { getPreviewResults } from "@/lib/quotes/preview";
import { sortQuotes } from "@/lib/quotes/scoring";
import { cn } from "@/lib/utils";

/* The landing page product preview: a real render of the comparison
   dashboard against the demonstration profile. Server-rendered, no JS. */
export async function ProductPreview({ className }: { className?: string }) {
  const results = await getPreviewResults();
  const quoted = results.filter((r) => r.status === "QUOTED" && r.quote).map((r) => ({ ...r, quote: r.quote! }));
  const ranked = sortQuotes(quoted, "value").slice(0, 3);
  const referred = results.filter((r) => r.status === "REFERRED").length;
  const declined = results.filter((r) => r.status === "DECLINED").length;
  const current = DEMO_PROFILE.driver.currentPremium ?? 0;

  return (
    <div
      className={cn(
        "surface-showroom reflection flex max-h-full w-full flex-col overflow-hidden rounded-(--radius-panel) p-4 sm:p-5",
        className,
      )}
      aria-label="Preview of the Coverwise comparison dashboard with demonstration data"
      role="img"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-ivory/50">Comparison</p>
          <p className="mt-0.5 truncate text-[14px] font-medium tracking-[-0.01em] text-ivory sm:text-[15px]">
            {vehicleTitle(DEMO_PROFILE.vehicle)}
          </p>
        </div>
        <Badge tone="glass" size="sm" className="mt-0.5">
          Demonstration data
        </Badge>
      </div>

      {/* Status strip */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ivory/70 sm:mt-4">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-champagne" aria-hidden />
          {results.length} providers contacted
        </span>
        <span className="text-ivory/30">·</span>
        <span>{quoted.length} quoted</span>
        <span className="hidden text-ivory/30 sm:inline">·</span>
        <span className="hidden sm:inline">{referred} referred</span>
        <span className="hidden text-ivory/30 sm:inline">·</span>
        <span className="hidden sm:inline">{declined} declined</span>
      </div>

      {/* Provider roster: one application fanned out to every adapter */}
      <ul className="mt-3 flex items-center gap-1.5 sm:mt-4" aria-label="Providers contacted">
        {PROVIDER_LIST.map((p) => {
          const r = results.find((x) => x.providerId === p.id);
          const dot = !p.connected
            ? "bg-white/20"
            : r?.status === "QUOTED"
              ? "bg-sage"
              : r?.status === "REFERRED"
                ? "bg-champagne"
                : r?.status === "DECLINED"
                  ? "bg-[#c0675c]"
                  : "bg-champagne/70";
          return (
            <li key={p.id} className="relative">
              <ProviderMark provider={p} size="sm" className={cn("size-6 rounded-[6px] text-[10px]", !p.connected && "opacity-40 grayscale")} />
              <span className={cn("absolute -right-0.5 -top-0.5 size-2 rounded-full ring-2 ring-[#131815]", dot)} aria-hidden />
            </li>
          );
        })}
        <li className="ml-1 hidden whitespace-nowrap text-[11px] text-ivory/50 sm:block">
          one application · {PROVIDER_LIST.length} providers
        </li>
      </ul>

      {/* Quote rows */}
      <ol className="mt-3 flex min-h-0 flex-col gap-2 sm:mt-4 sm:gap-2.5">
        {ranked.map((r, i) => {
          const p = PROVIDER_DEFINITIONS[r.providerId];
          const q = r.quote;
          const delta = current ? q.annualPremium - current : null;
          return (
            <li
              key={r.providerId}
              className={cn(
                "preview-row flex items-center gap-3 rounded-[13px] border border-white/8 bg-white/[0.045] px-3 py-2.5 hairline-light",
                i === 0 && "border-champagne/30 bg-white/[0.07]",
                i === 2 && "max-sm:hidden",
                i === 1 && "max-sm:[@media(max-height:760px)]:hidden",
              )}
              style={{ animationDelay: `${180 + i * 90}ms` }}
            >
              <ProviderMark provider={p} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[14px] font-medium text-ivory">{p.name}</p>
                  {i === 0 && (
                    <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.08em] text-champagne sm:inline">
                      Best value
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2.5 text-[12px] text-ivory/60">
                  <span className="tabular">Excess {formatAud(q.excess)}</span>
                  <span className="hidden sm:inline">{q.valuation === "agreed" ? "Agreed value" : "Market value"}</span>
                  <CoverageMeter score={q.coverageScore} tone="dark" showLabel={false} className="hidden sm:inline-flex" />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[17px] font-medium tabular tracking-[-0.02em] text-ivory sm:text-[18px]">
                  {formatAud(q.annualPremium)}
                  <span className="ml-0.5 text-[11px] font-normal text-ivory/50">/yr</span>
                </p>
                {delta !== null && (
                  <p className={cn("text-[11.5px] tabular", delta < 0 ? "text-sage" : "text-ivory/50")}>
                    {delta < 0 ? "−" : "+"}
                    {formatAud(Math.abs(delta))} vs current
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Feature diff strip */}
      <div className="mt-3 hidden grid-cols-3 gap-2 text-[11.5px] text-ivory/70 sm:mt-4 sm:grid">
        {[
          ["Choice of repairer", ranked.map((r) => r.quote.extras.choiceOfRepairer === "included")],
          ["Hire car", ranked.map((r) => r.quote.extras.hireCar === "included")],
          ["New car replacement", ranked.map((r) => r.quote.inclusions.some((x) => x.startsWith("New car")))],
        ].map(([label, flags]) => (
          <div key={label as string} className="flex items-center justify-between rounded-[10px] border border-white/8 bg-white/[0.03] px-2.5 py-2">
            <span className="truncate">{label as string}</span>
            <span className="flex gap-1.5" aria-hidden>
              {(flags as boolean[]).map((f, i) =>
                f ? (
                  <Check key={i} className="size-3.5 text-champagne" strokeWidth={2.5} />
                ) : (
                  <Minus key={i} className="size-3.5 text-ivory/30" strokeWidth={2} />
                ),
              )}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 hidden text-[10.5px] leading-snug text-ivory/40 sm:mt-4 sm:block">
        Illustrative demonstration — not an insurer quote. Fictional providers, synthetic pricing.
      </p>
    </div>
  );
}
