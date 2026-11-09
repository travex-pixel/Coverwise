"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Search, Sparkles } from "lucide-react";
import { StepFrame } from "@/components/compare/step-frame";
import { FormGrid, Reveal } from "@/components/compare/form-grid";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";
import { AU_STATES, vehicleSchema, type Vehicle, type VehicleInput } from "@/lib/application/schema";
import { useApplication, useStepNavigation } from "@/lib/application/store";
import type { RegistrationLookupResult } from "@/lib/registration/lookup";
import { useCurrentYear } from "@/lib/hooks/use-media-query";
import { MAKE_NAMES, findMake, findModel, yearsFor } from "@/lib/vehicles/data";

const OTHER = "__other__";

export function VehicleStep() {
  const { draft, setStep, completeStep, loadDemo, hydrated } = useApplication();
  const nav = useStepNavigation("vehicle");
  const [lookup, setLookup] = React.useState<{ state: "idle" | "loading" | "done"; result?: RegistrationLookupResult }>({ state: "idle" });

  const form = useForm<VehicleInput, unknown, Vehicle>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { registration: "", ...draft.vehicle },
    mode: "onTouched",
  });
  const { register, control, watch, setValue, handleSubmit, formState, reset } = form;

  // Re-sync when the stored draft arrives (hydration) or the demo profile is loaded.
  const draftKey = JSON.stringify(draft.vehicle);
  React.useEffect(() => {
    if (!hydrated) return;
    reset({ registration: "", ...draft.vehicle }, { keepDefaultValues: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, draftKey]);

  const make = watch("make");
  const model = watch("model");
  const variant = watch("variant");
  const modifications = watch("modifications");
  const registration = watch("registration");
  const state = watch("state");

  const makeRef = make ? findMake(make) : undefined;
  const makeIsOther = Boolean(make) && !makeRef;
  const modelRef = make && model ? findModel(make, model) : undefined;
  const thisYear = useCurrentYear();
  const years = yearsFor(make ?? "", model ?? "", thisYear);
  const variantOptions = modelRef?.variants ?? [];
  const variantIsCustom = Boolean(variant) && variantOptions.length > 0 && !variantOptions.includes(variant ?? "");
  const [customVariant, setCustomVariant] = React.useState(false);
  const showVariantInput = variantOptions.length === 0 || customVariant || variantIsCustom;

  const onSubmit = handleSubmit((data) => {
    setStep("vehicle", data);
    completeStep("vehicle");
    nav.goNext();
  });

  async function runLookup() {
    if (!registration || !state) return;
    setLookup({ state: "loading" });
    try {
      const res = await fetch("/api/registration/lookup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ registration, state }),
      });
      const result = (await res.json()) as RegistrationLookupResult;
      if (result.status === "found") {
        setValue("make", result.vehicle.make, { shouldValidate: true });
        setValue("model", result.vehicle.model, { shouldValidate: true });
        setValue("year", result.vehicle.year, { shouldValidate: true });
        if (result.vehicle.variant) setValue("variant", result.vehicle.variant, { shouldValidate: true });
      }
      setLookup({ state: "done", result });
    } catch {
      setLookup({ state: "done", result: { status: "not_connected", message: "Lookup unavailable. Enter details manually." } });
    }
  }

  return (
    <StepFrame
      step="vehicle"
      subtitle="Registration is optional — it only helps us pre-fill. Everything else takes about twenty seconds."
      onBack={nav.goPrev}
      formId="vehicle-form"
      headerAction={
        !draft.demo ? (
          <Button
            type="button"
            variant="subtle"
            size="sm"
            className="shrink-0"
            onClick={() => {
              loadDemo();
              setLookup({ state: "idle" });
            }}
          >
            <Sparkles className="size-3.5" strokeWidth={2} aria-hidden />
            Try the demo car
          </Button>
        ) : null
      }
    >
      <form id="vehicle-form" onSubmit={onSubmit} noValidate className="flex flex-col gap-1">
        <FormGrid className="sm:grid-cols-[1.2fr_1fr]">
          <Field
            label="Registration"
            optional
            error={formState.errors.registration?.message}
            trailing={
              <button
                type="button"
                onClick={runLookup}
                disabled={!registration || !state || lookup.state === "loading"}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-forest disabled:text-muted-2"
              >
                <Search className="size-3" strokeWidth={2.25} aria-hidden />
                {lookup.state === "loading" ? "Looking up…" : "Find my car"}
              </button>
            }
          >
            <Input
              {...register("registration")}
              placeholder="ABC123"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              maxLength={7}
              className="font-mono uppercase tracking-[0.12em]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  runLookup();
                }
              }}
            />
          </Field>
          <Field label="State" error={formState.errors.state?.message}>
            <Select
              {...register("state")}
              placeholder="Select"
              options={AU_STATES.map((s) => ({ value: s, label: s }))}
              value={state ?? ""}
            />
          </Field>
        </FormGrid>

        <Reveal show={lookup.state === "done"}>
          <div className="mb-3 flex items-start gap-2.5 rounded-[12px] border border-champagne-2/40 bg-champagne/15 px-3.5 py-3 text-[13px] leading-snug text-ink">
            <Info className="mt-0.5 size-4 shrink-0 text-champagne-3" strokeWidth={2} aria-hidden />
            <p>{lookup.result?.status === "found" ? "We found your car and filled in the details below." : lookup.result?.message}</p>
          </div>
        </Reveal>

        <FormGrid>
          <Field label="Make" error={formState.errors.make?.message}>
            <Controller
              control={control}
              name="make"
              render={({ field }) => (
                <Select
                  id={field.name}
                  name={field.name}
                  value={makeIsOther ? OTHER : (field.value ?? "")}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === OTHER ? "Other" : v);
                    setValue("model", "", { shouldValidate: false });
                    setValue("variant", "", { shouldValidate: false });
                    setCustomVariant(false);
                  }}
                  onBlur={field.onBlur}
                  placeholder="Select make"
                  options={[...MAKE_NAMES.map((m) => ({ value: m, label: m })), { value: OTHER, label: "Other make" }]}
                />
              )}
            />
          </Field>
          {makeIsOther && (
            <Field label="Make name" error={formState.errors.make?.message}>
              <Input {...register("make")} placeholder="e.g. Peugeot" autoComplete="off" />
            </Field>
          )}
          <Field label="Model" error={formState.errors.model?.message}>
            {makeRef ? (
              <Controller
                control={control}
                name="model"
                render={({ field }) => (
                  <Select
                    id={field.name}
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setValue("variant", "", { shouldValidate: false });
                      setCustomVariant(false);
                    }}
                    onBlur={field.onBlur}
                    placeholder={make ? "Select model" : "Choose a make first"}
                    disabled={!make}
                    options={makeRef.models.map((m) => ({ value: m.name, label: m.name }))}
                  />
                )}
              />
            ) : (
              <Input {...register("model")} placeholder="e.g. 3008" autoComplete="off" disabled={!make} />
            )}
          </Field>
        </FormGrid>

        <FormGrid className="sm:grid-cols-[0.8fr_1.2fr]">
          <Field label="Year" error={formState.errors.year?.message}>
            <Controller
              control={control}
              name="year"
              render={({ field }) => (
                <Select
                  id={field.name}
                  name={field.name}
                  value={field.value ? String(field.value) : ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  onBlur={field.onBlur}
                  placeholder="Year"
                  options={years.map((y) => ({ value: y, label: String(y) }))}
                />
              )}
            />
          </Field>
          <Field
            label="Variant"
            error={formState.errors.variant?.message}
            trailing={
              variantOptions.length > 0 ? (
                <button
                  type="button"
                  className="text-[12px] font-medium text-forest"
                  onClick={() => {
                    setCustomVariant((c) => !c);
                    setValue("variant", "", { shouldValidate: false });
                  }}
                >
                  {showVariantInput ? "Choose from list" : "Not listed?"}
                </button>
              ) : undefined
            }
          >
            {showVariantInput ? (
              <Input {...register("variant")} placeholder="e.g. 2.5i Premium" autoComplete="off" disabled={!model} />
            ) : (
              <Controller
                control={control}
                name="variant"
                render={({ field }) => (
                  <Select
                    id={field.name}
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    placeholder={model ? "Select variant" : "Choose a model first"}
                    disabled={!model}
                    options={variantOptions.map((v) => ({ value: v, label: v }))}
                  />
                )}
              />
            )}
          </Field>
        </FormGrid>

        <Field as="legend" label="Modifications" error={formState.errors.modifications?.message}>
          <Controller
            control={control}
            name="modifications"
            render={({ field }) => (
              <Segmented
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "none", label: "None" },
                  { value: "cosmetic", label: "Cosmetic" },
                  { value: "performance", label: "Performance" },
                ]}
              />
            )}
          />
        </Field>
        <Reveal show={Boolean(modifications) && modifications !== "none"}>
          <Field label="What's been modified?" error={formState.errors.modificationsDetail?.message}>
            <Input {...register("modificationsDetail")} placeholder="e.g. Aftermarket wheels, tint" autoComplete="off" />
          </Field>
        </Reveal>
      </form>
    </StepFrame>
  );
}
