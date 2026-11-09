"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CarFront, LifeBuoy, ShieldCheck, Wrench } from "lucide-react";
import { StepFrame } from "@/components/compare/step-frame";
import { FormGrid } from "@/components/compare/form-grid";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { SwitchRow } from "@/components/ui/switch";
import { EXCESS_OPTIONS, coverSchema, type Cover, type CoverInput } from "@/lib/application/schema";
import { EXTRA_LABELS } from "@/lib/application/labels";
import { useApplication, useStepNavigation } from "@/lib/application/store";
import { formatAud } from "@/lib/format";

const EXTRA_META = {
  choiceOfRepairer: { icon: Wrench, description: "Use your own repairer rather than the insurer's network." },
  hireCar: { icon: CarFront, description: "A hire car while yours is repaired, even when you're at fault." },
  windscreen: { icon: ShieldCheck, description: "Replace glass without paying your excess." },
  roadside: { icon: LifeBuoy, description: "Breakdown assistance bundled with the policy." },
} as const;

export function CoverStep() {
  const { draft, setStep, completeStep, hydrated } = useApplication();
  const nav = useStepNavigation("cover");

  const form = useForm<CoverInput, unknown, Cover>({
    resolver: zodResolver(coverSchema),
    defaultValues: {
      coverType: "comprehensive",
      excess: 1000,
      extras: { choiceOfRepairer: false, hireCar: false, windscreen: false, roadside: false },
      ...draft.cover,
    },
    mode: "onTouched",
  });
  const { control, handleSubmit, formState, reset } = form;

  const draftKey = JSON.stringify(draft.cover);
  React.useEffect(() => {
    if (hydrated) reset({ coverType: "comprehensive", excess: 1000, extras: { choiceOfRepairer: false, hireCar: false, windscreen: false, roadside: false }, ...draft.cover });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, draftKey]);

  const onSubmit = handleSubmit((data) => {
    setStep("cover", data);
    completeStep("cover");
    nav.goNext();
  });

  return (
    <StepFrame
      step="cover"
      subtitle="Preferences, not commitments. Providers will tell us how closely they can match them."
      onBack={nav.goPrev}
      formId="cover-form"
      continueLabel="Review"
    >
      <form id="cover-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        <Field label="Cover type">
          <div className="flex items-center gap-3 rounded-[12px] border border-forest/40 bg-white px-3.5 py-3">
            <span className="flex size-9 items-center justify-center rounded-[9px] bg-forest text-ivory">
              <ShieldCheck className="size-[18px]" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[14px] font-medium leading-tight">Comprehensive</span>
              <span className="mt-0.5 text-[12px] leading-snug text-muted">
                Covers your car and damage to others. Third party cover is coming later.
              </span>
            </span>
            <Badge tone="forest" size="sm">
              Selected
            </Badge>
          </div>
        </Field>

        <FormGrid>
          <Field as="legend" label="Valuation basis" error={formState.errors.valuation?.message}>
            <Controller
              control={control}
              name="valuation"
              render={({ field }) => (
                <Segmented
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "agreed", label: "Agreed value", description: "Fixed payout, set up front" },
                    { value: "market", label: "Market value", description: "Value at time of loss" },
                  ]}
                />
              )}
            />
          </Field>
          <Field
            as="legend"
            label="Preferred excess"
            hint="A higher excess usually lowers the premium."
            error={formState.errors.excess?.message}
          >
            <Controller
              control={control}
              name="excess"
              render={({ field }) => (
                <Segmented
                  value={typeof field.value === "number" ? field.value : Number(field.value)}
                  onChange={field.onChange}
                  size="sm"
                  options={EXCESS_OPTIONS.map((e) => ({ value: e, label: formatAud(e).replace(",", ",") }))}
                />
              )}
            />
          </Field>
        </FormGrid>

        <Field as="legend" label="Optional extras" optional>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(EXTRA_META) as (keyof typeof EXTRA_META)[]).map((key) => {
              const Icon = EXTRA_META[key].icon;
              return (
                <Controller
                  key={key}
                  control={control}
                  name={`extras.${key}`}
                  render={({ field }) => (
                    <SwitchRow
                      checked={Boolean(field.value)}
                      onCheckedChange={field.onChange}
                      icon={<Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />}
                      title={EXTRA_LABELS[key]}
                      description={EXTRA_META[key].description}
                    />
                  )}
                />
              );
            })}
          </div>
        </Field>
      </form>
    </StepFrame>
  );
}
