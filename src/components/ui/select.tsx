"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlBase, useControlProps } from "./field";

/* Native select, styled. On mobile the OS picker is the best possible
   control; on desktop the chrome is restyled to match our inputs. */

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: ReadonlyArray<{ value: string | number; label: string; disabled?: boolean }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, placeholder, options, value, defaultValue, ...props }, ref) => {
    const controlProps = useControlProps(props);
    const isEmpty = (value ?? defaultValue ?? "") === "";
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            controlBase,
            "appearance-none truncate pr-10",
            isEmpty && "text-muted-2/80",
            className,
          )}
          value={value}
          defaultValue={defaultValue}
          {...controlProps}
        >
          {placeholder !== undefined && (
            <option value="" disabled={props.required}>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-2"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    );
  },
);
Select.displayName = "Select";
