"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Pencil, Send } from "lucide-react";
import { StepFrame } from "@/components/compare/step-frame";
import { ProvidersDialog } from "@/components/landing/providers-dialog";
import { Button } from "@/components/ui/button";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { ProviderMark } from "@/components/ui/provider-mark";
import {
  COUNT_LABELS,
  EXTRA_LABELS,
  KM_LABELS,
  LICENCE_LABELS,
  MODIFICATION_LABELS,
  PARKING_LABELS,
  SECURITY_LABELS,
  USE_LABELS,
  VALUATION_LABELS,
  YEARS_LICENSED_LABELS,
  vehicleTitle,
} from "@/lib/application/labels";
import { STEP_META, type StepId } from "@/lib/application/schema";
import { cacheComparison } from "@/lib/application/comparison-cache";
import { useApplication, useStepNavigation } from "@/lib/application/store";
import { formatAud } from "@/lib/format";
import type { ComparisonRecord } from "@/lib/providers/orchestrator";
import { PROVIDER_LIST } from "@/lib/providers/registry";
import { cn } from "@/lib/utils";

type Row = [string, React.ReactNode];

function SummaryCard({
  step,
  rows,
  complete,
  onEdit,
}: {
  step: Exclude<StepId, "review">;
  rows: Row[];
  complete: boolean;
  onEdit: () => void;
}) {
  return (
    <section className={cn("surface-card rounded-[14px] p-3.5 sm:p-4", !complete && "border-warn/40")}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">{STEP_META[step].label}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 rounded-md text-[12.5px] font-medium text-forest hover:underline"
        >
          <Pencil className="size-3" strokeWidth={2.25} aria-hidden />
          Edit
        </button>
      </div>
      {complete ? (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[13px]">
          {rows.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="text-muted">{k}</dt>
              <dd className="truncate text-right font-medium text-ink tabular">{v}</dd>
            </React.Fragment>
          ))}
        </dl>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="flex w-full items-center gap-2 rounded-[10px] bg-warn/8 px-3 py-2 text-left text-[13px] text-warn"
        >
          <AlertCircle className="size-4" strokeWidth={2} aria-hidden />
          This step isn&apos;t complete yet
          <ArrowRight className="ml-auto size-3.5" strokeWidth={2} aria-hidden />
        </button>
      )}
    </section>
  );
}

export function ReviewStep() {
  const router = useRouter();
  const { draft, application, stepValidity, hydrated } = useApplication();
  const nav = useStepNavigation("review");
  const [consentShare, setConsentShare] = React.useState(false);
  const [consentDemo, setConsentDemo] = React.useState(false);
  const [attempted, setAttempted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const connected = PROVIDER_LIST.filter((p) => p.connected);
  const v = draft.vehicle;
  const d = draft.driver;
  const u = draft.usage;
  const c = draft.cover;

  const extras = c.extras ? (Object.keys(c.extras) as (keyof typeof c.extras)[]).filter((k) => c.extras?.[k]) : [];

  async function submit() {
    setAttempted(true);
    if (!application || !consentShare || !consentDemo) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          application,
          consent: {
            shareWithProviders: true,
            acknowledgeDemonstration: true,
            consentedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const record = (await res.json()) as ComparisonRecord;
      cacheComparison(record);
      router.push(`/results/${record.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const ready = Boolean(application) && consentShare && consentDemo;

  return (
    <StepFrame
      step="review"
      subtitle="Nothing has been shared yet. Check your details, then authorise Coverwise to send one standardised application to the participating providers."
      onBack={nav.goPrev}
      footer={
        <Button size="lg" loading={submitting} disabled={!hydrated} onClick={submit} className="min-w-[200px]">
          {submitting ? "Submitting" : `Submit to ${connected.length} providers`}
          {!submitting && <Send className="size-4" strokeWidth={2} aria-hidden />}
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryCard
          step="vehicle"
          complete={stepValidity.vehicle}
          onEdit={() => nav.goTo("vehicle")}
          rows={[
            ["Vehicle", v.make && v.model ? vehicleTitle({ ...v, year: Number(v.year) } as Parameters<typeof vehicleTitle>[0]) : "—"],
            ["Registration", v.registration ? `${v.registration} · ${v.state}` : (v.state ?? "—")],
            ["Modifications", v.modifications ? MODIFICATION_LABELS[v.modifications] : "—"],
          ]}
        />
        <SummaryCard
          step="driver"
          complete={stepValidity.driver}
          onEdit={() => nav.goTo("driver")}
          rows={[
            ["Driver", d.age ? `${d.age}, ${d.licenceType ? LICENCE_LABELS[d.licenceType].toLowerCase() : ""} licence` : "—"],
            ["Licensed", d.yearsLicensed ? YEARS_LICENSED_LABELS[d.yearsLicensed] : "—"],
            ["Claims / infringements", `${d.claims ? COUNT_LABELS[d.claims] : "—"} / ${d.infringements ? COUNT_LABELS[d.infringements] : "—"}`],
            ["Additional drivers", d.additionalDrivers ? COUNT_LABELS[d.additionalDrivers] : "—"],
            ["Current cover", d.currentlyInsured ? `${d.currentInsurer ?? "Insured"}${d.currentPremium ? ` · ${formatAud(Number(d.currentPremium))}/yr` : ""}` : "Not insured"],
          ]}
        />
        <SummaryCard
          step="usage"
          complete={stepValidity.usage}
          onEdit={() => nav.goTo("usage")}
          rows={[
            ["Postcode", u.postcode ?? "—"],
            ["Overnight", u.parking ? PARKING_LABELS[u.parking] : "—"],
            ["Kilometres", u.annualKm ? KM_LABELS[u.annualKm] : "—"],
            ["Use", u.use ? USE_LABELS[u.use] : "—"],
            ["Security", u.security?.length ? u.security.map((s) => SECURITY_LABELS[s]).join(", ") : "None"],
          ]}
        />
        <SummaryCard
          step="cover"
          complete={stepValidity.cover}
          onEdit={() => nav.goTo("cover")}
          rows={[
            ["Cover", "Comprehensive"],
            ["Valuation", c.valuation ? VALUATION_LABELS[c.valuation] : "—"],
            ["Preferred excess", c.excess ? formatAud(Number(c.excess)) : "—"],
            ["Extras", extras.length ? extras.map((e) => EXTRA_LABELS[e]).join(", ") : "None"],
          ]}
        />
      </div>

      <section className="surface-card mt-3 rounded-[14px] p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Who receives your details</h2>
            <p className="mt-1 text-[13.5px] leading-snug text-muted">
              {connected.length} participating providers via their approved channels. Providers not yet connected receive nothing.
            </p>
          </div>
          <ProvidersDialog>
            <button type="button" className="shrink-0 text-[12.5px] font-medium text-forest hover:underline">
              View all
            </button>
          </ProvidersDialog>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {connected.map((p) => (
            <li key={p.id} className="flex items-center gap-1.5 rounded-full border border-line bg-white/70 py-1 pl-1 pr-2.5 text-[12.5px]">
              <ProviderMark provider={p} size="sm" className="size-5 rounded-[5px] text-[10px]" />
              {p.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-3 flex flex-col gap-2">
        <CheckboxRow
          checked={consentShare}
          onCheckedChange={setConsentShare}
          error={attempted && !consentShare ? "Consent is required before we share your details" : undefined}
        >
          I authorise Coverwise to share the details above with the {connected.length} participating providers listed, for the
          purpose of obtaining comprehensive car insurance quotes.
        </CheckboxRow>
        <CheckboxRow
          checked={consentDemo}
          onCheckedChange={setConsentDemo}
          error={attempted && !consentDemo ? "Please acknowledge this before continuing" : undefined}
        >
          I understand Coverwise is a demonstration: providers are fictional, results are illustrative and are not insurer
          quotes or financial advice.
        </CheckboxRow>
        {attempted && !application && (
          <p className="text-[13px] text-danger">Complete every step above before submitting.</p>
        )}
        {error && <p className="text-[13px] text-danger">{error}</p>}
        {!ready && hydrated && !attempted && (
          <p className="text-[12.5px] text-muted-2">Tick both boxes to enable submission.</p>
        )}
      </section>
    </StepFrame>
  );
}
