"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxRowProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  error?: string;
  id?: string;
}

export function CheckboxRow({ checked, onCheckedChange, children, error, id }: CheckboxRowProps) {
  const autoId = React.useId();
  const inputId = id ?? `cb-${autoId}`;
  return (
    <div>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-[12px] border px-3.5 py-3 transition-colors duration-(--dur-fast)",
          checked ? "border-forest/50 bg-white" : "border-line bg-white/60 hover:border-line-strong hover:bg-white",
          error && !checked && "border-danger/50",
        )}
      >
        <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="peer absolute inset-0 size-full cursor-pointer opacity-0"
            aria-invalid={Boolean(error) || undefined}
          />
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-[6px] border transition-all duration-(--dur-fast)",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-forest/40 peer-focus-visible:ring-offset-2",
              checked ? "border-forest bg-forest text-ivory" : "border-line-strong bg-white",
            )}
            aria-hidden
          >
            <Check className={cn("size-3 transition-transform", checked ? "scale-100" : "scale-0")} strokeWidth={3} />
          </span>
        </span>
        <span className="text-[13.5px] leading-snug text-ink">{children}</span>
      </label>
      {error && <p className="mt-1 text-[12.5px] text-danger">{error}</p>}
    </div>
  );
}
