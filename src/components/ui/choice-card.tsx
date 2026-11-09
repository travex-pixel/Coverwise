"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* Selectable card used for multi-select chips and option grids. */

interface ChoiceCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "title"> {
  selected: boolean;
  onSelectedChange: (next: boolean) => void;
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  role?: "checkbox" | "radio";
  compact?: boolean;
}

export function ChoiceCard({
  selected,
  onSelectedChange,
  icon,
  title,
  description,
  meta,
  role = "checkbox",
  compact,
  className,
  ...props
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={() => onSelectedChange(role === "radio" ? true : !selected)}
      className={cn(
        "group/choice relative flex w-full items-center gap-3 rounded-[12px] border text-left",
        "transition-[border-color,background-color,box-shadow,transform] duration-(--dur-fast) ease-(--ease-out)",
        "active:scale-[0.99]",
        compact ? "min-h-11 px-3 py-2" : "min-h-14 px-3.5 py-3",
        selected
          ? "border-forest/70 bg-white shadow-[0_0_0_1px_rgb(20_36_29/0.5),0_1px_2px_rgb(17_21_18/0.05),0_6px_16px_-8px_rgb(20_36_29/0.3)]"
          : "border-line bg-white/60 hover:border-line-strong hover:bg-white",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[9px] transition-colors",
            selected ? "bg-forest text-ivory" : "bg-ink/[0.05] text-muted group-hover/choice:text-ink",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[14px] font-medium leading-tight text-ink">{title}</span>
        {description && <span className="mt-0.5 text-[12px] leading-snug text-muted">{description}</span>}
      </span>
      {meta && <span className="shrink-0 text-[12px] tabular text-muted">{meta}</span>}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-(--dur-fast)",
          role === "radio" ? "rounded-full" : "rounded-[6px]",
          selected ? "border-forest bg-forest text-ivory" : "border-line-strong bg-white",
        )}
        aria-hidden
      >
        <Check
          className={cn("size-3 transition-transform duration-(--dur-fast)", selected ? "scale-100" : "scale-0")}
          strokeWidth={3}
        />
      </span>
    </button>
  );
}
