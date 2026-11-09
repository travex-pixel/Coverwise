"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const POINTS = [
  ["Shared only with consent", "Nothing leaves your browser until you confirm on the final step."],
  ["Minimal collection", "Only what insurers need to rate a policy. No name, email or phone."],
  ["Clear provenance", "Every result shows where it came from and when."],
  ["Deletion on request", "Sessions expire after 30 days. Delete yours any time from results."],
  ["Not advice", "Coverwise compares. It does not advise or arrange insurance. Read each insurer's PDS."],
];

export function PrivacyDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent title="Privacy and trust" description="How your information is treated.">
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
