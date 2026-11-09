"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { STEP_META, STEP_ORDER, type StepId } from "@/lib/application/schema";
import { useApplication } from "@/lib/application/store";
import { cn } from "@/lib/utils";

/* Fixed-viewport application shell: header with progress, scrollable
   content region, no page-level scrolling. */

export function CompareShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { draft, stepValidity, reset } = useApplication();
  const current = (pathname.split("/")[2] ?? "vehicle") as StepId;
  const currentIndex = Math.max(0, STEP_ORDER.indexOf(current));
  const [exitOpen, setExitOpen] = React.useState(false);

  const hasData = draft.completed.length > 0 || Object.keys(draft.vehicle).some((k) => (draft.vehicle as Record<string, unknown>)[k]);

  return (
    <div className="ambient-ivory flex h-dvh flex-col overflow-hidden">
      <header className="relative z-10 flex h-14 shrink-0 items-center gap-3 px-4 sm:px-6">
        <Wordmark compact className="sm:hidden" />
        <Wordmark className="hidden sm:inline-flex" />

        {/* Progress */}
        <nav aria-label="Progress" className="mx-auto flex min-w-0 flex-1 items-center justify-center">
          <ol className="flex w-full max-w-[520px] items-center gap-1.5 sm:gap-2">
            {STEP_ORDER.map((step, i) => {
              const done = step !== "review" && stepValidity[step] && i < currentIndex;
              const active = i === currentIndex;
              const reachable = i <= currentIndex || (step !== "review" && stepValidity[step]) || done;
              return (
                <li key={step} className="flex min-w-0 flex-1 flex-col items-stretch gap-1.5">
                  <Link
                    href={STEP_META[step].path}
                    aria-current={active ? "step" : undefined}
                    aria-disabled={!reachable}
                    tabIndex={reachable ? 0 : -1}
                    onClick={(e) => !reachable && e.preventDefault()}
                    className={cn(
                      "group/step block rounded-full py-1.5 outline-offset-4",
                      !reachable && "pointer-events-none",
                    )}
                  >
                    <span
                      className={cn(
                        "block h-[3px] w-full rounded-full transition-colors duration-(--dur) ease-(--ease-out)",
                        active || done ? "bg-forest" : "bg-ink/12 group-hover/step:bg-ink/25",
                      )}
                    />
                    <span
                      className={cn(
                        "mt-1 hidden text-center text-[11px] font-medium tracking-[0.02em] sm:block",
                        active ? "text-ink" : done ? "text-forest" : "text-muted-2",
                      )}
                    >
                      {STEP_META[step].label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-1">
          <span className="hidden text-[12px] tabular text-muted-2 sm:block">
            {currentIndex + 1}
            <span className="opacity-60"> / {STEP_ORDER.length}</span>
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Exit comparison"
            onClick={() => (hasData ? setExitOpen(true) : router.push("/"))}
          >
            <X className="size-4" strokeWidth={2} />
          </Button>
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col">{children}</main>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent
          size="sm"
          title="Leave your comparison?"
          description="Your answers are saved in this browser tab, so you can come back and pick up where you left off."
          footer={
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  reset();
                  setExitOpen(false);
                  router.push("/");
                }}
              >
                Discard answers
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setExitOpen(false);
                  router.push("/");
                }}
              >
                Keep and leave
              </Button>
              <Button onClick={() => setExitOpen(false)}>Stay</Button>
            </div>
          }
        />
      </Dialog>
    </div>
  );
}
