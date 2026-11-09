import Link from "next/link";
import { ArrowRight, Layers, PenLine, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowItWorksDialog } from "./how-it-works-dialog";

export function Hero() {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="rise text-[12px] font-medium uppercase tracking-[0.12em] text-champagne-3" style={{ animationDelay: "0ms" }}>
        Comprehensive car insurance · Australia
      </p>
      <h1
        className="rise mt-3 text-balance text-[clamp(2.1rem,5.6vw,3.9rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink sm:mt-4"
        style={{ animationDelay: "60ms" }}
      >
        Stop{" "}
        <em className="font-serif font-normal italic tracking-[-0.02em] text-forest">shopping around</em>{" "}
        for insurance.
      </h1>
      <p
        className="rise mt-3 max-w-[34rem] text-pretty text-[15px] leading-[1.5] text-muted sm:mt-5 sm:text-[17px]"
        style={{ animationDelay: "120ms" }}
      >
        Tell us about your car once. We&apos;ll help you compare available insurance options from participating
        providers — without visiting a dozen websites.
      </p>

      <div className="rise mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:gap-3" style={{ animationDelay: "180ms" }}>
        <Button asChild size="xl" className="w-full sm:w-auto sm:min-w-[220px]">
          <Link href="/compare/vehicle">
            Start my comparison
            <ArrowRight className="size-4 transition-transform duration-(--dur-fast) group-hover/button:translate-x-0.5" strokeWidth={2.25} aria-hidden />
          </Link>
        </Button>
        <HowItWorksDialog>
          <Button variant="secondary" size="xl" className="w-full sm:w-auto">
            See how it works
          </Button>
        </HowItWorksDialog>
      </div>

      <p className="rise mt-3 text-[13px] text-muted-2 sm:mt-4" style={{ animationDelay: "240ms" }}>
        Your details entered once. Your options, all in one place.
      </p>

      <ul
        className="rise mt-6 hidden gap-x-8 gap-y-3 text-[13.5px] text-muted sm:mt-9 sm:flex sm:flex-wrap"
        style={{ animationDelay: "300ms" }}
      >
        {[
          [PenLine, "Enter your details once"],
          [Layers, "Participating providers compared"],
          [Scale, "Coverage differences made visible"],
        ].map(([Icon, label]) => {
          const I = Icon as typeof PenLine;
          return (
            <li key={label as string} className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-forest/8 text-forest">
                <I className="size-3.5" strokeWidth={2} aria-hidden />
              </span>
              {label as string}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
