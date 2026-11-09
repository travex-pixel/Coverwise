"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LayoutGrid, List, Plus, Trash2 } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";
import { vehicleTitle } from "@/lib/application/labels";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { SORT_LABELS, sortQuotes, type SortKey } from "@/lib/quotes/scoring";
import type { Quote } from "@/lib/providers/types";
import { cn } from "@/lib/utils";
import { FeatureMatrix } from "./feature-matrix";
import { Pipeline } from "./pipeline";
import { ProviderJourney } from "./provider-journey";
import { QuoteCard } from "./quote-card";
import { QuoteDetail } from "./quote-detail";
import { useComparison } from "./use-comparison";

type Tab = "quotes" | "providers";
type View = "list" | "matrix";

export function ResultsView() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const reduce = useReducedMotion();
  const { state, retry, retrying, remove, markSeen } = useComparison(id);
  const [tab, setTab] = React.useState<Tab>("quotes");
  const [view, setView] = React.useState<View>("list");
  const [sort, setSort] = React.useState<SortKey>("value");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (state.status === "loading") return <ResultsSkeleton />;
  if (state.status === "missing") return <MissingState />;

  const { record, fresh } = state;
  const quoted = record.results
    .filter((r) => r.status === "QUOTED" && r.quote)
    .map((r) => ({ result: r, quote: r.quote as Quote, provider: record.providers.find((p) => p.id === r.providerId)! }));
  const sorted = sortQuotes(quoted, sort);
  const counts = {
    contacted: record.results.filter((r) => r.status !== "NOT_CONNECTED").length,
    quoted: quoted.length,
    referred: record.results.filter((r) => r.status === "REFERRED").length,
    declined: record.results.filter((r) => r.status === "DECLINED").length,
    attention: record.results.filter((r) => r.status === "MANUAL_ACTION_REQUIRED" || r.status === "ERROR").length,
    notConnected: record.results.filter((r) => r.status === "NOT_CONNECTED").length,
  };
  const cheapestId = [...quoted].sort((a, b) => a.quote.annualPremium - b.quote.annualPremium)[0]?.provider.id;
  const bestCoverId = [...quoted].sort((a, b) => b.quote.coverageScore - a.quote.coverageScore)[0]?.provider.id;
  const bestValueId = sortQuotes(quoted, "value")[0]?.provider.id;

  const activeId = selectedId ?? (isDesktop ? bestValueId : null);
  const active = activeId ? quoted.find((q) => q.provider.id === activeId) : undefined;
  const currentPremium = record.application.driver.currentPremium;

  function select(idToSelect: string) {
    setSelectedId(idToSelect);
    setTab("quotes");
    if (!isDesktop) setSheetOpen(true);
  }

  const highlightFor = (pid: string) =>
    pid === bestValueId ? "Best overall value" : pid === cheapestId ? "Cheapest" : pid === bestCoverId ? "Best coverage" : undefined;

  return (
    <div className="ambient-ivory flex h-dvh flex-col overflow-hidden">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
        <Wordmark compact className="sm:hidden" />
        <Wordmark className="hidden sm:inline-flex" />
        <div className="mx-auto hidden min-w-0 items-center gap-2 md:flex">
          <p className="truncate text-[14px] font-medium tracking-[-0.01em]">{vehicleTitle(record.application.vehicle)}</p>
          <Badge tone="champagne" size="sm">
            Demonstration
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted hover:text-danger"
            aria-label="Delete my data"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-3.5" strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Delete my data</span>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/compare/vehicle">
              <Plus className="size-3.5" strokeWidth={2.25} aria-hidden />
              New comparison
            </Link>
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        {fresh ? (
          <motion.div key="pipeline" className="flex min-h-0 flex-1 flex-col" exit={{ opacity: 0, scale: 0.99 }} transition={{ duration: 0.25 }}>
            <Pipeline record={record} onDone={markSeen} />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="flex min-h-0 flex-1 flex-col"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Summary strip */}
            <div className="shrink-0 px-4 sm:px-6">
              <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-4 gap-y-2 border-b border-line/80 pb-3">
                <div className="min-w-0 md:hidden">
                  <p className="truncate text-[15px] font-medium tracking-[-0.01em]">{vehicleTitle(record.application.vehicle)}</p>
                </div>
                <ul className="no-scrollbar flex items-center gap-1.5 overflow-x-auto text-[12.5px]">
                  <Chip label="contacted" n={counts.contacted} />
                  <Chip label="quoted" n={counts.quoted} tone="success" />
                  <Chip label="referred" n={counts.referred} tone="warn" />
                  <Chip label="need attention" n={counts.attention} tone="warn" />
                  <Chip label="declined" n={counts.declined} tone="danger" />
                  <Chip label="not connected" n={counts.notConnected} />
                </ul>
                <p className="ml-auto hidden text-[12px] text-muted-2 lg:block">
                  Illustrative demonstration — not insurer quotes.
                </p>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 px-4 pt-3 sm:px-6">
              <div className="mx-auto grid w-full max-w-[1200px] min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
                {/* Left: controls + list */}
                <div className="flex min-h-0 flex-col">
                  <div className="flex shrink-0 flex-wrap items-center gap-2 pb-3">
                    <Segmented<Tab>
                      value={tab}
                      onChange={setTab}
                      size="sm"
                      className="w-auto"
                      options={[
                        { value: "quotes", label: `Quotes · ${counts.quoted}` },
                        { value: "providers", label: `All providers · ${record.results.length}` },
                      ]}
                    />
                    {tab === "quotes" && (
                      <>
                        <div className="ml-auto flex items-center gap-2">
                          <label className="sr-only" htmlFor="sort">
                            Sort quotes
                          </label>
                          <Select
                            id="sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            options={(Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({ value: k, label: SORT_LABELS[k] }))}
                            className="h-9 w-auto min-w-[170px] rounded-[8px] pr-9 text-[13px]"
                          />
                          <div className="flex rounded-[8px] border border-line bg-white/70 p-0.5">
                            {(
                              [
                                ["list", List, "List view"],
                                ["matrix", LayoutGrid, "Compare features"],
                              ] as const
                            ).map(([v, Icon, label]) => (
                              <button
                                key={v}
                                type="button"
                                aria-label={label}
                                aria-pressed={view === v}
                                onClick={() => setView(v)}
                                className={cn(
                                  "flex size-8 items-center justify-center rounded-[6px] transition-colors",
                                  view === v ? "bg-ink text-ivory" : "text-muted hover:text-ink",
                                )}
                              >
                                <Icon className="size-4" strokeWidth={2} aria-hidden />
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6 pr-0.5 pt-2.5">
                    {tab === "quotes" ? (
                      quoted.length === 0 ? (
                        <EmptyQuotes />
                      ) : view === "list" ? (
                        <ol className="flex flex-col gap-3">
                          <AnimatePresence initial={false}>
                            {sorted.map((q, i) => (
                              <motion.li
                                key={q.provider.id}
                                layout={reduce ? false : "position"}
                                transition={{ type: "spring", stiffness: 420, damping: 38 }}
                              >
                                <QuoteCard
                                  provider={q.provider}
                                  quote={q.quote}
                                  rank={i + 1}
                                  highlight={highlightFor(q.provider.id)}
                                  selected={isDesktop && activeId === q.provider.id}
                                  currentPremium={currentPremium}
                                  onSelect={() => select(q.provider.id)}
                                />
                              </motion.li>
                            ))}
                          </AnimatePresence>
                          <li className="pt-1 text-[11.5px] leading-snug text-muted-2">
                            &ldquo;Best overall value&rdquo; weighs price against coverage breadth. The cheapest premium is not the best
                            policy for everyone — check excess, valuation and exclusions.
                          </li>
                        </ol>
                      ) : (
                        <FeatureMatrix items={sorted} onSelect={select} selectedId={activeId ?? undefined} />
                      )
                    ) : (
                      <ProviderJourney record={record} retry={retry} retrying={retrying} onViewQuote={select} />
                    )}
                  </div>
                </div>

                {/* Right: detail (desktop) */}
                <aside className="hidden min-h-0 lg:flex lg:flex-col">
                  <div className="surface-card scrollbar-thin min-h-0 flex-1 overflow-y-auto rounded-[16px] p-5 mb-6">
                    {active ? (
                      <QuoteDetail provider={active.provider} result={active.result} quote={active.quote} submittedAt={record.createdAt} />
                    ) : (
                      <p className="text-[13.5px] text-muted">Select a quote to see its full detail.</p>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile detail sheet */}
      <Dialog open={sheetOpen && !isDesktop} onOpenChange={setSheetOpen}>
        {active && (
          <DialogContent title={`${active.provider.name} quote`} hideTitle size="md">
            <QuoteDetail provider={active.provider} result={active.result} quote={active.quote} submittedAt={record.createdAt} />
          </DialogContent>
        )}
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          size="sm"
          title="Delete this comparison?"
          description="Your application details, consent record and every provider response for this session will be permanently deleted."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                Keep
              </Button>
              <Button
                className="bg-danger hover:bg-danger/90"
                loading={deleting}
                onClick={async () => {
                  setDeleting(true);
                  await remove();
                  router.push("/");
                }}
              >
                Delete everything
              </Button>
            </div>
          }
        />
      </Dialog>
    </div>
  );
}

function Chip({ label, n, tone }: { label: string; n: number; tone?: "success" | "warn" | "danger" }) {
  if (n === 0 && label !== "contacted") return null;
  return (
    <li
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
        tone === "success" && "border-success/15 bg-success/8 text-success",
        tone === "warn" && "border-warn/20 bg-warn/8 text-warn",
        tone === "danger" && "border-danger/20 bg-danger/8 text-danger",
        !tone && "border-line bg-white/70 text-muted",
      )}
    >
      <span className="font-medium tabular">{n}</span>
      {label}
    </li>
  );
}

function EmptyQuotes() {
  return (
    <div className="surface-card rounded-[14px] p-6 text-center">
      <p className="text-[15px] font-medium">No quotes were returned this time.</p>
      <p className="mt-1 text-[13.5px] text-muted">
        Check the provider journey for referrals, declines and retries — or adjust your cover preferences and try again.
      </p>
      <Button asChild variant="secondary" className="mt-4">
        <Link href="/compare/cover">Adjust preferences</Link>
      </Button>
    </div>
  );
}

function MissingState() {
  return (
    <div className="ambient-ivory flex h-dvh flex-col">
      <header className="flex h-14 items-center px-4 sm:px-6">
        <Wordmark />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="surface-card max-w-[420px] rounded-[16px] p-6 text-center">
          <p className="text-[18px] font-medium tracking-[-0.015em]">This comparison isn&apos;t available.</p>
          <p className="mt-2 text-[13.5px] leading-snug text-muted">
            Demonstration sessions live in the browser tab that created them, and are deleted on request. Start a new
            comparison — it takes about three minutes.
          </p>
          <Button asChild className="mt-5">
            <Link href="/compare/vehicle">Start a new comparison</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="ambient-ivory flex h-dvh flex-col overflow-hidden" aria-busy aria-label="Loading comparison">
      <header className="flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
        <Wordmark />
        <div className="ml-auto skeleton h-8 w-32" />
      </header>
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1200px] gap-2 border-b border-line/80 pb-3">
          {[80, 72, 72, 96].map((w, i) => (
            <div key={i} className="skeleton h-6 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>
      <div className="px-4 pt-4 sm:px-6">
        <div className="mx-auto grid w-full max-w-[1200px] gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-[112px] rounded-[14px]" />
            ))}
          </div>
          <div className="skeleton hidden h-[480px] rounded-[16px] lg:block" />
        </div>
      </div>
    </div>
  );
}
