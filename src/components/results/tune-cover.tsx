"use client";

import * as React from "react";
import { CarFront, LifeBuoy, ShieldCheck, SlidersHorizontal, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/segmented";
import { SwitchRow } from "@/components/ui/switch";
import { EXTRA_LABELS } from "@/lib/application/labels";
import { EXCESS_OPTIONS, type Application, type ExcessOption } from "@/lib/application/schema";
import { formatAud } from "@/lib/format";

/* Explore the demonstration: change cover preferences and watch every
   provider re-price. The same standardised application goes out again,
   so the customer never re-enters anything. */

const EXTRA_ICONS = { choiceOfRepairer: Wrench, hireCar: CarFront, windscreen: ShieldCheck, roadside: LifeBuoy } as const;

export function TuneCover({
  cover,
  onChange,
  busy,
}: {
  cover: Application["cover"];
  onChange: (cover: Application["cover"]) => void;
  busy: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" loading={busy}>
          {!busy && <SlidersHorizontal className="size-3.5" strokeWidth={2.25} aria-hidden />}
          {busy ? "Re-pricing" : "Tune cover"}
        </Button>
      </DialogTrigger>
      <DialogContent
        size="sm"
        title="Tune your cover"
        description="Every provider re-prices as you change these."
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-muted-2">{busy ? "Re-pricing with every provider" : "Up to date"}</p>
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <section>
            <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Excess</p>
            <Segmented<ExcessOption>
              value={cover.excess as ExcessOption}
              onChange={(excess) => onChange({ ...cover, excess })}
              size="sm"
              options={EXCESS_OPTIONS.map((e) => ({ value: e, label: formatAud(e) }))}
            />
          </section>
          <section>
            <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Valuation</p>
            <Segmented<"agreed" | "market">
              value={cover.valuation}
              onChange={(valuation) => onChange({ ...cover, valuation })}
              options={[
                { value: "agreed", label: "Agreed value" },
                { value: "market", label: "Market value" },
              ]}
            />
          </section>
          <section>
            <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-2">Extras</p>
            <div className="flex flex-col gap-2">
              {(Object.keys(EXTRA_ICONS) as (keyof typeof EXTRA_ICONS)[]).map((key) => {
                const Icon = EXTRA_ICONS[key];
                return (
                  <SwitchRow
                    key={key}
                    checked={cover.extras[key]}
                    onCheckedChange={(v) => onChange({ ...cover, extras: { ...cover.extras, [key]: v } })}
                    icon={<Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />}
                    title={EXTRA_LABELS[key]}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
