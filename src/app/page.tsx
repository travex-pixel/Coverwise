import { Hero } from "@/components/landing/hero";
import { HeroArt } from "@/components/landing/hero-art";
import { LandingNav } from "@/components/landing/nav";
import { QuoteStrip } from "@/components/landing/quote-strip";
import { PaperGrain, Wash } from "@/components/ui/watercolour";

export default function LandingPage() {
  return (
    <div className="relative flex h-dvh min-h-[600px] flex-col overflow-hidden bg-ivory">
      <PaperGrain opacity={0.22} />
      {/* Editorial washes: a sage horizon and a warm champagne light, kept off the type */}
      <Wash tone="sage" shape="stroke" seed={6} opacity={0.3} className="absolute -left-[6%] bottom-[10%] h-[12vh] w-[80vw] lg:hidden" />

      <LandingNav />

      <main className="relative flex min-h-0 flex-1 flex-col px-4 pb-2 pt-1 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-4 lg:px-12 lg:pb-4">
        {/* Copy */}
        <div className="relative z-10 shrink-0 lg:pb-6">
          <Hero />
          <div className="rise mt-8 hidden w-[372px] lg:block lg:[@media(max-height:820px)]:hidden" style={{ animationDelay: "260ms" }}>
            <QuoteStrip />
          </div>
        </div>

        {/* Artwork + proof card */}
        <div className="relative mt-1 flex min-h-0 flex-1 flex-col justify-center gap-2 md:gap-6 lg:mt-0 lg:h-[min(640px,76vh)] lg:flex-none lg:justify-center lg:gap-0">
          <div className="rise relative min-h-0 flex-1 md:h-[min(440px,44vh)] md:flex-none lg:h-auto" style={{ animationDelay: "140ms" }}>
            {/* Mobile: the whole car, framed as a band on its wash. Cropped only above and below. */}
            <div className="relative -mx-4 h-full min-h-[120px] max-h-[230px] md:max-h-[440px] lg:hidden">
              <HeroArt priority fill sizes="100vw" className="object-cover object-[50%_60%]" />
            </div>
            {/* Desktop: full composition */}
            <div className="relative hidden w-[106%] lg:block lg:-mr-[6%]">
              <HeroArt priority sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
          </div>
          <div className="rise relative z-10 w-full shrink-0 md:mx-auto md:max-w-[560px] lg:hidden" style={{ animationDelay: "260ms" }}>
            <QuoteStrip />
          </div>
        </div>
      </main>

      <footer className="relative flex h-9 shrink-0 items-center justify-between px-4 text-[11px] text-muted-2 sm:px-8 lg:px-12">
        <p className="truncate">
          <span className="sm:hidden">Demonstration only. Not insurer quotes. Not financial advice.</span>
          <span className="hidden sm:inline">
            Coverwise is a comparison technology demonstration. Illustrative results are not insurer quotes. Not
            financial advice.
          </span>
        </p>
        <p className="hidden sm:block">© 2026 Coverwise</p>
      </footer>
    </div>
  );
}
