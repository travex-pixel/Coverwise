import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowItWorksDialog } from "./how-it-works-dialog";

export function Hero() {
  return (
    <div className="flex min-w-0 flex-col">
      <p className="rise flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.14em] text-champagne-3" style={{ animationDelay: "0ms" }}>
        <span className="h-px w-8 bg-champagne-2/70" aria-hidden />
        <span className="sm:hidden">Car insurance · Australia</span>
        <span className="hidden sm:inline">Comprehensive car insurance · Australia</span>
      </p>
      <h1
        className="rise mt-4 text-balance text-[clamp(2.25rem,5vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink sm:mt-5"
        style={{ animationDelay: "60ms" }}
      >
        Stop{" "}
        <em className="font-serif font-normal italic tracking-[-0.02em] text-forest">shopping around</em>
        <br className="hidden lg:block" /> for insurance.
      </h1>
      <p
        className="rise mt-4 max-w-[30rem] text-pretty text-[15px] leading-[1.5] text-muted sm:mt-6 sm:text-[17.5px]"
        style={{ animationDelay: "120ms" }}
      >
        Tell us about your car once. See how participating providers compare, all in one place.
      </p>

      <div className="rise mt-5 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-4" style={{ animationDelay: "180ms" }}>
        <Button asChild size="xl" className="w-full sm:w-auto sm:min-w-[232px]">
          <Link href="/compare/vehicle">
            Start my comparison
            <ArrowRight className="size-4 transition-transform duration-(--dur-fast) group-hover/button:translate-x-0.5" strokeWidth={2.25} aria-hidden />
          </Link>
        </Button>
        <HowItWorksDialog>
          <button className="group/link inline-flex h-[52px] items-center justify-center gap-1.5 text-[15px] font-medium text-ink underline-offset-[6px] decoration-champagne-2 hover:underline sm:justify-start">
            See how it works
            <ArrowRight className="size-3.5 text-champagne-3 transition-transform group-hover/link:translate-x-0.5" strokeWidth={2.25} aria-hidden />
          </button>
        </HowItWorksDialog>
      </div>

      <p className="rise mt-3 text-[13px] text-muted-2 sm:mt-5" style={{ animationDelay: "240ms" }}>
        Your details entered once. Your options, all in one place.
      </p>
    </div>
  );
}
