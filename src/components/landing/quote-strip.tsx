import { Badge } from "@/components/ui/badge";
import { ProviderMark } from "@/components/ui/provider-mark";
import { DEMO_PROFILE } from "@/lib/application/demo-profile";
import { formatAud } from "@/lib/format";
import { PROVIDER_DEFINITIONS, PROVIDER_LIST } from "@/lib/providers/registry";
import { getPreviewResults } from "@/lib/quotes/preview";
import { sortQuotes } from "@/lib/quotes/scoring";
import { cn } from "@/lib/utils";

/* A compact proof-of-product card for the editorial hero: a sliver of the
   real comparison dashboard, driven by the demo engine. */
export async function QuoteStrip({ className }: { className?: string }) {
  const results = await getPreviewResults();
  const quoted = results.filter((r) => r.status === "QUOTED" && r.quote).map((r) => ({ ...r, quote: r.quote! }));
  const ranked = sortQuotes(quoted, "value").slice(0, 3);
  const current = DEMO_PROFILE.driver.currentPremium ?? 0;
  const contacted = results.length;
  const connected = PROVIDER_LIST.filter((p) => p.connected).length;

  return (
    <div
      className={cn(
        "surface-showroom reflection flex w-full flex-col rounded-[18px] p-3.5 sm:p-4",
        className,
      )}
      role="img"
      aria-label="Preview of a Coverwise comparison for a 2024 Subaru Forester using demonstration data"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-ivory/50">One application</p>
          <p className="truncate text-[13px] font-medium text-ivory">
            {contacted} contacted · {quoted.length} quoted
          </p>
        </div>
        <Badge tone="glass" size="sm">
          Demonstration
        </Badge>
      </div>
      <ol className="mt-2.5 flex flex-col gap-1.5">
        {ranked.map((r, i) => {
          const p = PROVIDER_DEFINITIONS[r.providerId];
          const delta = current ? r.quote.annualPremium - current : null;
          return (
            <li
              key={r.providerId}
              className={cn(
                "preview-row flex items-center gap-2.5 rounded-[11px] border border-white/8 bg-white/[0.045] px-2.5 py-1.5 hairline-light",
                i === 0 && "border-champagne/30 bg-white/[0.07]",
                i === 2 && "max-sm:hidden",
              )}
              style={{ animationDelay: `${220 + i * 90}ms` }}
            >
              <ProviderMark provider={p} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-ivory">{p.name}</p>
                <p className="truncate text-[10.5px] text-ivory/55">
                  Excess {formatAud(r.quote.excess)} · {r.quote.valuation === "agreed" ? "Agreed value" : "Market value"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-medium tabular leading-none tracking-[-0.02em] text-ivory">
                  {formatAud(r.quote.annualPremium)}
                  <span className="ml-0.5 text-[10px] font-normal text-ivory/50">/yr</span>
                </p>
                {delta !== null && (
                  <p className={cn("mt-0.5 text-[10px] tabular", delta < 0 ? "text-sage" : "text-ivory/45")}>
                    {delta < 0 ? "−" : "+"}
                    {formatAud(Math.abs(delta))} vs current
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-[10px] leading-snug text-ivory/40">
        Illustrative, not insurer quotes. {connected} demo adapters, {PROVIDER_LIST.length - connected} insurers not yet connected.
      </p>
    </div>
  );
}
