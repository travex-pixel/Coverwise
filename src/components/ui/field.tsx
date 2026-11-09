"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldContextValue {
  id: string;
  errorId: string;
  hintId: string;
  invalid: boolean;
  hasHint: boolean;
}
const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return React.useContext(FieldContext);
}

interface FieldProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  /** Render label visually as a group legend (for segmented controls etc.). */
  as?: "label" | "legend";
  trailing?: React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  optional,
  as = "label",
  trailing,
  className,
  children,
  ...props
}: FieldProps) {
  const id = React.useId();
  const value = React.useMemo<FieldContextValue>(
    () => ({
      id: `f-${id}`,
      errorId: `f-${id}-err`,
      hintId: `f-${id}-hint`,
      invalid: Boolean(error),
      hasHint: Boolean(hint),
    }),
    [id, error, hint],
  );

  const labelEl = (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] font-medium tracking-[-0.005em] text-ink">
        {label}
        {optional && <span className="ml-1.5 text-[12px] font-normal text-muted-2">Optional</span>}
      </span>
      {trailing}
    </div>
  );

  const Wrapper: React.ElementType = as === "legend" ? "fieldset" : "div";

  return (
    <FieldContext.Provider value={value}>
      <Wrapper className={cn("group/field flex min-w-0 flex-col gap-1.5", className)} {...props}>
        {as === "legend" ? (
          <legend className="contents">{labelEl}</legend>
        ) : (
          <label htmlFor={value.id} className="cursor-default">
            {labelEl}
          </label>
        )}
        {children}
        <div className="min-h-[18px] text-[12.5px] leading-[18px]" aria-live="polite">
          {error ? (
            <p id={value.errorId} className="text-danger">
              {error}
            </p>
          ) : hint ? (
            <p id={value.hintId} className="text-muted-2">
              {hint}
            </p>
          ) : null}
        </div>
      </Wrapper>
    </FieldContext.Provider>
  );
}

export const controlBase = cn(
  "h-11 w-full min-w-0 rounded-(--radius-control) border bg-white/70 px-3.5 text-[15px] text-ink",
  "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),0_1px_2px_rgb(17_21_18/0.04)]",
  "placeholder:text-muted-2/80",
  "transition-[border-color,box-shadow,background-color] duration-(--dur-fast) ease-(--ease-out)",
  "hover:border-line-strong focus:bg-white focus:outline-none",
  "focus:border-forest focus:shadow-[0_0_0_3px_rgb(20_36_29/0.12),inset_0_1px_0_0_rgb(255_255_255/0.9)]",
  "aria-invalid:border-danger aria-invalid:focus:shadow-[0_0_0_3px_rgb(155_59_49/0.14)]",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export function useControlProps(props: { id?: string; "aria-describedby"?: string }) {
  const ctx = useFieldContext();
  if (!ctx) return props;
  const describedBy = [props["aria-describedby"], ctx.invalid ? ctx.errorId : ctx.hasHint ? ctx.hintId : null]
    .filter(Boolean)
    .join(" ");
  return {
    ...props,
    id: props.id ?? ctx.id,
    "aria-invalid": ctx.invalid || undefined,
    "aria-describedby": describedBy || undefined,
  };
}
