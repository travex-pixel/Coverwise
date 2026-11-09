"use client";

import Image from "next/image";
import { Wash } from "@/components/ui/watercolour";
import art from "../../../public/art/suv-watercolour-sm.webp";

/* Desktop companion panel for the vehicle step: the watercolour SUV on
   paper, with the vehicle title filling in as the customer types. */
export function VehicleAside({
  make,
  model,
  year,
  variant,
  demo,
}: {
  make?: string;
  model?: string;
  year?: number | string;
  variant?: string;
  demo: boolean;
}) {
  const title = [year, make, model, variant].filter(Boolean).join(" ");
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-line bg-paper shadow-card">
      <Wash tone="sage" shape="stroke" seed={5} opacity={0.5} className="absolute -left-[10%] bottom-[18%] h-[40%] w-[120%]" />
      <Wash tone="champagne" shape="pool" seed={9} opacity={0.3} className="absolute -right-[20%] top-[-10%] h-[50%] w-[70%]" />
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={art}
          alt=""
          aria-hidden
          sizes="300px"
          className="absolute left-1/2 top-1/2 w-[135%] max-w-none -translate-x-[48%] -translate-y-[50%]"
          draggable={false}
        />
      </div>
      <div className="relative border-t border-line/80 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-champagne-3">Your car</p>
        <p className="mt-1 min-h-[22px] text-[15px] font-medium tracking-[-0.01em] text-ink">
          {title || <span className="text-muted-2">Fill in the details and it appears here</span>}
        </p>
        {demo && <p className="mt-0.5 text-[12px] text-muted-2">Demonstration profile · anonymised</p>}
      </div>
    </div>
  );
}
