"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { controlBase, useControlProps } from "./field";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    const controlProps = useControlProps(props);
    if (!prefix && !suffix) {
      return <input ref={ref} className={cn(controlBase, className)} {...controlProps} />;
    }
    return (
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 text-[15px] text-muted-2">{prefix}</span>
        )}
        <input
          ref={ref}
          className={cn(controlBase, prefix && "pl-8", suffix && "pr-14", className)}
          {...controlProps}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 text-[13px] text-muted-2">{suffix}</span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
