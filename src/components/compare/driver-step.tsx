"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepFrame } from "@/components/compare/step-frame";
import { FormGrid, Reveal } from "@/components/compare/form-grid";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";
import {
  COUNT_BANDS,
  LICENCE_TYPES,
  YEARS_LICENSED,
  driverSchema,
  type Driver,
  type DriverInput,
} from "@/lib/application/schema";
import { COUNT_LABELS, CURRENT_INSURERS, LICENCE_LABELS, YEARS_LICENSED_LABELS } from "@/lib/application/labels";
import { useApplication, useStepNavigation } from "@/lib/application/store";

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export function DriverStep() {
  const { draft, setStep, completeStep, hydrated } = useApplication();
  const nav = useStepNavigation("driver");

  const form = useForm<DriverInput, unknown, Driver>({
    resolver: zodResolver(driverSchema),
    defaultValues: draft.driver,
    mode: "onTouched",
  });
  const { register, control, watch, handleSubmit, formState, reset, setValue } = form;

  const draftKey = JSON.stringify(draft.driver);
  React.useEffect(() => {
    if (hydrated) reset(draft.driver);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, draftKey]);

  const claims = watch("claims");
  const additionalDrivers = watch("additionalDrivers");
  const currentlyInsured = watch("currentlyInsured");
  const currentInsurer = watch("currentInsurer");

  const onSubmit = handleSubmit((data) => {
    setStep("driver", data);
    completeStep("driver");
    nav.goNext();
  });

  return (
    <StepFrame
      step="driver"
      subtitle="The main driver. Follow-ups only when relevant."
      onBack={nav.goPrev}
      formId="driver-form"
    >
      <form id="driver-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        <FormGrid className="sm:grid-cols-[0.7fr_1.3fr]">
          <Field label="Driver age" error={formState.errors.age?.message}>
            <Input
              {...register("age")}
              type="number"
              inputMode="numeric"
              min={16}
              max={99}
              placeholder="31"
              autoComplete="off"
              className="tabular"
            />
          </Field>
          <Field label="Licence type" error={formState.errors.licenceType?.message}>
            <Controller
              control={control}
              name="licenceType"
              render={({ field }) => (
                <Select
                  id={field.name}
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder="Select"
                  options={LICENCE_TYPES.map((t) => ({ value: t, label: LICENCE_LABELS[t] }))}
                />
              )}
            />
          </Field>
        </FormGrid>

        <Field as="legend" label="Years licensed" error={formState.errors.yearsLicensed?.message}>
          <Controller
            control={control}
            name="yearsLicensed"
            render={({ field }) => (
              <Segmented
                value={field.value}
                onChange={field.onChange}
                size="sm"
                options={YEARS_LICENSED.map((y) => ({ value: y, label: YEARS_LICENSED_LABELS[y].replace(" years", "").replace("Under 1 year", "<1").replace(" year", "") }))}
              />
            )}
          />
        </Field>

        <FormGrid>
          <Field as="legend" label="Claims in the last 5 years" error={formState.errors.claims?.message}>
            <Controller
              control={control}
              name="claims"
              render={({ field }) => (
                <Segmented
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    if (v === "none") setValue("claimsAtFault", undefined);
                  }}
                  options={COUNT_BANDS.map((c) => ({ value: c, label: COUNT_LABELS[c].replace("Two or more", "2+") }))}
                />
              )}
            />
          </Field>
          <Field as="legend" label="Infringements in the last 3 years" error={formState.errors.infringements?.message}>
            <Controller
              control={control}
              name="infringements"
              render={({ field }) => (
                <Segmented
                  value={field.value}
                  onChange={field.onChange}
                  options={COUNT_BANDS.map((c) => ({ value: c, label: COUNT_LABELS[c].replace("Two or more", "2+") }))}
                />
              )}
            />
          </Field>
        </FormGrid>

        <Reveal show={Boolean(claims) && claims !== "none"}>
          <Field as="legend" label="Was any claim at fault?" error={formState.errors.claimsAtFault?.message}>
            <Controller
              control={control}
              name="claimsAtFault"
              render={({ field }) => (
                <Segmented
                  value={field.value === undefined ? undefined : field.value ? "yes" : "no"}
                  onChange={(v) => field.onChange(v === "yes")}
                  options={YES_NO}
                  className="sm:max-w-[280px]"
                />
              )}
            />
          </Field>
        </Reveal>

        <FormGrid>
          <Field as="legend" label="Additional drivers" error={formState.errors.additionalDrivers?.message}>
            <Controller
              control={control}
              name="additionalDrivers"
              render={({ field }) => (
                <Segmented
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    if (v === "none") setValue("youngestAdditionalDriverAge", undefined);
                  }}
                  options={COUNT_BANDS.map((c) => ({ value: c, label: COUNT_LABELS[c].replace("Two or more", "2+") }))}
                />
              )}
            />
          </Field>
          <Reveal show={Boolean(additionalDrivers) && additionalDrivers !== "none"}>
            <Field label="Youngest additional driver's age" error={formState.errors.youngestAdditionalDriverAge?.message}>
              <Input
                {...register("youngestAdditionalDriverAge")}
                type="number"
                inputMode="numeric"
                min={16}
                max={99}
                placeholder="e.g. 28"
                className="tabular"
              />
            </Field>
          </Reveal>
        </FormGrid>

        <Field as="legend" label="Is the car currently insured?" error={formState.errors.currentlyInsured?.message}>
          <Controller
            control={control}
            name="currentlyInsured"
            render={({ field }) => (
              <Segmented
                value={field.value === undefined ? undefined : field.value ? "yes" : "no"}
                onChange={(v) => {
                  field.onChange(v === "yes");
                  if (v === "no") {
                    setValue("currentInsurer", undefined);
                    setValue("currentPremium", undefined);
                  }
                }}
                options={YES_NO}
                className="sm:max-w-[280px]"
              />
            )}
          />
        </Field>
        <Reveal show={currentlyInsured === true}>
          <FormGrid>
            <Field label="Current insurer" optional error={formState.errors.currentInsurer?.message}>
              <Select
                {...register("currentInsurer")}
                value={currentInsurer ?? ""}
                placeholder="Select"
                options={CURRENT_INSURERS.map((i) => ({ value: i, label: i }))}
              />
            </Field>
            <Field
              label="Current annual premium"
              optional
              hint="Used only as your personal benchmark on the results screen."
              error={formState.errors.currentPremium?.message}
            >
              <Input
                {...register("currentPremium", { setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)) })}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                prefix="$"
                suffix="/ year"
                placeholder="1,000"
                className="tabular"
              />
            </Field>
          </FormGrid>
        </Reveal>
      </form>
    </StepFrame>
  );
}
