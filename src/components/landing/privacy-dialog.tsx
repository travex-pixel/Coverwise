"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const POINTS = [
  ["Entered once, shared with consent", "Nothing leaves your browser until you review your details and explicitly consent on the final step."],
  ["Minimal collection", "We ask only what insurers need to rate a comprehensive policy. No name, email or phone number is required for a demonstration comparison."],
  ["Clear provenance", "Every result shows which provider it came from, how it was obtained and when."],
  ["Deletion on request", "Demonstration sessions are retained for 30 days and can be deleted at any time from the results screen."],
  ["Not advice", "Coverwise is comparison technology. It does not provide financial product advice and does not arrange insurance. Read each insurer's Product Disclosure Statement before deciding."],
];

export function PrivacyDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="Privacy and trust" description="How Coverwise treats your information.">
        <ul className="flex flex-col divide-y divide-line">
          {POINTS.map(([t, b]) => (
            <li key={t} className="py-3 first:pt-0 last:pb-0">
              <p className="text-[14.5px] font-medium tracking-[-0.01em]">{t}</p>
              <p className="mt-1 text-[13.5px] leading-snug text-muted">{b}</p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
