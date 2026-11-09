"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Car, Home, KeyRound, MapPin, Radar, Siren, Warehouse } from "lucide-react";
import { StepFrame } from "@/components/compare/step-frame";
import { FormGrid } from "@/components/compare/form-grid";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { KM_BANDS, SECURITY, USE_TYPES, usageSchema, type Usage, type UsageInput } from "@/lib/application/schema";
import { PARKING_LABELS, SECURITY_LABELS, USE_LABELS } from "@/lib/application/labels";
import { useApplication, useStepNavigation } from "@/lib/application/store";

const PARKING_OPTIONS = [
  { value: "garage", icon: Warehouse, description: "Locked, off-street" },
  { value: "carport", icon: Home, description: "Covered, open sides" },
  { value: "driveway", icon: Car, description: "Off-street, uncovered" },
  { value: "street", icon: MapPin, description: "On the street" },
] as const;

const SECURITY_ICONS = { immobiliser: KeyRound, alarm: Siren, tracker: Radar, dashcam: Camera } as const;

const KM_SHORT: Record<(typeof KM_BANDS)[number], string> = {
  "<5000": "<5k",
  "5000-10000": "5–10k",
  "10000-15000": "10–15k",
  "15000-20000": "15–20k",
  "20000+": "20k+",
};

export function UsageStep() {
  const { draft, setStep, completeStep, hydrated } = useApplication();
  const nav = useStepNavigation("usage");

  const form = useForm<UsageInput, unknown, Usage>({
    resolver: zodResolver(usageSchema),
    defaultValues: { security: [], ...draft.usage },
    mode: "onTouched",
  });
  const { register, control, handleSubmit, formState, reset } = form;

  const draftKey = JSON.stringify(draft.usage);
  React.useEffect(() => {
    if (hydrated) reset({ security: [], ...draft.usage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, draftKey]);

  const onSubmit = handleSubmit((data) => {
    setStep("usage", data);
    completeStep("usage");
    nav.goNext();
  });

  return (
    <StepFrame
      step="usage"
      subtitle="Where it's kept and how far it goes."
      onBack={nav.goPrev}
      formId="usage-form"
    >
      <form id="usage-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        <FormGrid className="sm:grid-cols-[0.7fr_1.3fr]">
          <Field label="Garaging postcode" error={formState.errors.postcode?.message}>
            <Input
              {...register("postcode")}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="2205"
              autoComplete="postal-code"
              className="tabular"
            />
          </Field>
          <Field as="legend" label="Annual kilometres" error={formState.errors.annualKm?.message}>
            <Controller
              control={control}
              name="annualKm"
              render={({ field }) => (
                <Segmented
                  value={field.value}
                  onChange={field.onChange}
                  size="sm"
                  options={KM_BANDS.map((k) => ({ value: k, label: KM_SHORT[k] }))}
                />
              )}
            />
          </Field>
        </FormGrid>

        <Field as="legend" label="Overnight parking" error={formState.errors.parking?.message}>
          <Controller
            control={control}
            name="parking"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2" role="radiogroup">
                {PARKING_OPTIONS.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    role="radio"
                    selected={field.value === opt.value}
                    onSelectedChange={() => field.onChange(opt.value)}
                    icon={<opt.icon className="size-[18px]" strokeWidth={1.75} aria-hidden />}
                    title={PARKING_LABELS[opt.value]}
                    description={opt.description}
                  />
                ))}
              </div>
            )}
          />
        </Field>

        <Field as="legend" label="How the car is used" error={formState.errors.use?.message}>
          <Controller
            control={control}
            name="use"
            render={({ field }) => (
              <Segmented
                value={field.value}
                onChange={field.onChange}
                options={USE_TYPES.map((u) => ({ value: u, label: USE_LABELS[u].replace("Private and commuting", "Commuting") }))}
              />
            )}
          />
        </Field>

        <Field as="legend" label="Security features" optional>
          <Controller
            control={control}
            name="security"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {SECURITY.map((s) => {
                  const Icon = SECURITY_ICONS[s];
                  const selected = (field.value ?? []).includes(s);
                  return (
                    <ChoiceCard
                      key={s}
                      compact
                      selected={selected}
                      onSelectedChange={(next) => {
                        const set = new Set(field.value ?? []);
                        if (next) set.add(s);
                        else set.delete(s);
                        field.onChange(SECURITY.filter((x) => set.has(x)));
                      }}
                      icon={<Icon className="size-4" strokeWidth={1.75} aria-hidden />}
                      title={SECURITY_LABELS[s]}
                    />
                  );
                })}
              </div>
            )}
          />
        </Field>
      </form>
    </StepFrame>
  );
}
