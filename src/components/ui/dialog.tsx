"use client";

import * as React from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* Modal sheet: centred dialog on desktop, bottom sheet on small screens.
   One component, two ergonomics. */

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

interface DialogContentProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixDialog.Content>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Visually hide the title (still announced). */
  hideTitle?: boolean;
  size?: "sm" | "md" | "lg";
  /** Optional dark showroom treatment. */
  tone?: "light" | "dark";
  footer?: React.ReactNode;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, title, description, hideTitle, size = "md", tone = "light", footer, ...props }, ref) => {
    return (
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className="dialog-overlay fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]"
        />
        <RadixDialog.Content
          ref={ref}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden outline-none",
            // Mobile: bottom sheet
            "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[22px]",
            // Desktop: centred
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85dvh] sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-(--radius-panel)",
            size === "sm" && "sm:max-w-[440px]",
            size === "md" && "sm:max-w-[560px]",
            size === "lg" && "sm:max-w-[760px]",
            tone === "light" ? "bg-paper text-ink shadow-float" : "surface-showroom",
            "dialog-content",
            className,
          )}
          {...props}
        >
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
            <div className="min-w-0">
              <RadixDialog.Title
                className={cn(
                  "text-[19px] font-medium leading-tight tracking-[-0.015em]",
                  hideTitle && "sr-only",
                )}
              >
                {title}
              </RadixDialog.Title>
              {description ? (
                <RadixDialog.Description
                  className={cn("mt-1.5 text-[14px] leading-snug", tone === "light" ? "text-muted" : "text-ivory/70")}
                >
                  {description}
                </RadixDialog.Description>
              ) : (
                <RadixDialog.Description className="sr-only">Dialog</RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                tone === "light" ? "bg-ink/6 text-muted hover:bg-ink/10 hover:text-ink" : "bg-white/10 text-ivory/80 hover:bg-white/15",
              )}
              aria-label="Close"
            >
              <X className="size-4" strokeWidth={2} />
            </RadixDialog.Close>
          </div>
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
          {footer && (
            <div
              className={cn(
                "border-t px-5 py-4 sm:px-6",
                tone === "light" ? "border-line bg-ivory/60" : "border-white/10 bg-black/20",
                "pb-[max(1rem,env(safe-area-inset-bottom))]",
              )}
            >
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    );
  },
);
DialogContent.displayName = "DialogContent";
