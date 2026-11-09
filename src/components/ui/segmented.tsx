"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useFieldContext } from "./field";

/* Segmented control: a radio group with a sliding highlight. */

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: React.ReactNode;
  description?: string;
}

interface SegmentedProps<T extends string | number> {
  value: T | undefined;
  onChange: (value: T) => void;
  options: ReadonlyArray<SegmentedOption<T>>;
  name?: string;
  className?: string;
  /** Allow wrapping to multiple rows (for 4+ options on mobile). */
  columns?: number;
  size?: "sm" | "md";
}

export function Segmented<T extends string | number>({
  value,
  onChange,
  options,
  name,
  className,
  columns,
  size = "md",
}: SegmentedProps<T>) {
  const ctx = useFieldContext();
  const reduce = useReducedMotion();
  const groupId = React.useId();
  const layoutId = `seg-${groupId}`;

  return (
    <div
      role="radiogroup"
      aria-invalid={ctx?.invalid || undefined}
      aria-describedby={ctx?.invalid ? ctx.errorId : undefined}
      className={cn(
        "relative grid gap-1 rounded-[12px] border bg-ink/[0.035] p-1",
        "shadow-[inset_0_1px_2px_rgb(17_21_18/0.05)]",
        ctx?.invalid && "border-danger/60",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            name={name}
            tabIndex={selected || (value === undefined && i === 0) ? 0 : -1}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => {
              const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
              if (!dir) return;
              e.preventDefault();
              const next = options[(i + dir + options.length) % options.length];
              onChange(next.value);
              const el = (e.currentTarget.parentElement?.children[(i + dir + options.length) % options.length] as HTMLElement | undefined);
              el?.focus();
            }}
            className={cn(
              "relative isolate flex min-w-0 flex-col items-center justify-center rounded-[9px] px-2 text-center",
              "transition-colors duration-(--dur-fast) ease-(--ease-out)",
              size === "md" ? "min-h-10 py-1.5 text-[14px]" : "min-h-8 py-1 text-[13px]",
              selected ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40, mass: 0.6 }}
                className="absolute inset-0 -z-10 rounded-[9px] bg-white shadow-[0_1px_2px_rgb(17_21_18/0.08),0_2px_8px_-2px_rgb(17_21_18/0.12),inset_0_1px_0_0_rgb(255_255_255/0.9)] ring-1 ring-ink/[0.06]"
              />
            )}
            <span className="truncate font-medium leading-tight">{opt.label}</span>
            {opt.description && (
              <span className={cn("mt-0.5 text-[11px] leading-tight", selected ? "text-muted" : "text-muted-2")}>
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
