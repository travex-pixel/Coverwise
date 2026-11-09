"use client";

import * as React from "react";
import { Switch as RadixSwitch } from "radix-ui";
import { cn } from "@/lib/utils";

interface SwitchRowProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export function SwitchRow({ checked, onCheckedChange, title, description, icon, className, id }: SwitchRowProps) {
  const autoId = React.useId();
  const switchId = id ?? `sw-${autoId}`;
  return (
    <label
      htmlFor={switchId}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[12px] border px-3.5 py-3 transition-colors duration-(--dur-fast)",
        checked ? "border-forest/50 bg-white" : "border-line bg-white/60 hover:border-line-strong hover:bg-white",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-[9px] transition-colors",
            checked ? "bg-forest text-ivory" : "bg-ink/[0.05] text-muted",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[14px] font-medium leading-tight text-ink">{title}</span>
        {description && <span className="mt-0.5 text-[12px] leading-snug text-muted">{description}</span>}
      </span>
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-(--dur) ease-(--ease-out)",
          "shadow-[inset_0_1px_2px_rgb(17_21_18/0.15)]",
          "data-[state=checked]:bg-forest data-[state=unchecked]:bg-ink/15",
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            "block size-[22px] translate-x-[2px] rounded-full bg-white",
            "shadow-[0_1px_2px_rgb(17_21_18/0.25),0_2px_6px_rgb(17_21_18/0.15)]",
            "transition-transform duration-(--dur) ease-(--ease-out) data-[state=checked]:translate-x-[20px]",
          )}
        />
      </RadixSwitch.Root>
    </label>
  );
}
