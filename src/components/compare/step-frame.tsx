"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEP_META, STEP_ORDER, type StepId } from "@/lib/application/schema";
import { cn } from "@/lib/utils";

/* One journey step: heading, contained-scroll body, pinned footer.
   The footer stays in normal flow so it remains visible when the mobile
   keyboard shrinks the dynamic viewport. */

interface StepFrameProps {
  step: StepId;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
  continueLabel?: React.ReactNode;
  formId?: string;
  loading?: boolean;
  continueDisabled?: boolean;
  aside?: React.ReactNode;
  /** Replace the default continue button. */
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function StepFrame({
  step,
  title,
  subtitle,
  children,
  onBack,
  backLabel = "Back",
  continueLabel = "Continue",
  formId,
  loading,
  continueDisabled,
  aside,
  footer,
  headerAction,
}: StepFrameProps) {
  const index = STEP_ORDER.indexOf(step);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-4 pt-2 sm:px-6 sm:pt-4">
        <div className={cn("mx-auto flex w-full max-w-[560px] flex-1 flex-col", aside && "lg:max-w-[920px] lg:flex-row lg:items-start lg:gap-10")}>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-champagne-3">
                  Step {index + 1} · {STEP_META[step].label}
                </p>
                <h1 className="mt-1.5 text-balance text-[26px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[32px]">
                  {title ?? STEP_META[step].title}
                </h1>
                {subtitle && <p className="mt-2 text-pretty text-[14px] leading-snug text-muted sm:text-[15px]">{subtitle}</p>}
              </div>
              {headerAction && <div className="shrink-0">{headerAction}</div>}
            </div>
            {children}
          </div>
          {aside && <div className="mt-6 hidden w-[300px] shrink-0 lg:block lg:sticky lg:top-0">{aside}</div>}
        </div>
      </div>

      <div className="shrink-0 border-t border-line/80 bg-ivory/80 px-4 py-3 backdrop-blur-md sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-[560px] items-center justify-between gap-3 lg:max-w-[920px]">
          <Button type="button" variant="ghost" size="lg" onClick={onBack} className="-ml-2 text-muted hover:text-ink">
            <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
            {backLabel}
          </Button>
          {footer ?? (
            <Button
              type="submit"
              form={formId}
              size="lg"
              loading={loading}
              disabled={continueDisabled}
              className="min-w-[150px]"
            >
              {continueLabel}
              {!loading && <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
