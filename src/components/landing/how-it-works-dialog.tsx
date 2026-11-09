"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FileText, Layers, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const STEPS = [
  {
    icon: FileText,
    title: "Tell us once",
    body: "Your car, your driving, your cover. About three minutes.",
  },
  {
    icon: Layers,
    title: "We coordinate the comparison",
    body: "With your consent, one application goes to every participating provider.",
  },
  {
    icon: Scale,
    title: "Compare what actually differs",
    body: "Premium, excess, inclusions and exclusions, side by side. Referrals and declines too.",
  },
];

export function HowItWorksDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        title="How Coverwise works"
        description="One application. Every participating provider."
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] leading-snug text-muted">Demonstration. Results are illustrative, not quotes.</p>
            <Button asChild size="md">
              <Link href="/compare/vehicle">
                Start
                <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
              </Link>
            </Button>
          </div>
        }
      >
        <ol className="flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="surface-card flex gap-4 rounded-[14px] p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-forest text-ivory">
                <s.icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="flex items-baseline gap-2 text-[15px] font-medium tracking-[-0.01em]">
                  <span className="font-mono text-[11px] text-muted-2">0{i + 1}</span>
                  {s.title}
                </p>
                <p className="mt-1 text-[13.5px] leading-snug text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
