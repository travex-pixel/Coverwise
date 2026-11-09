import { Hero } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/nav";
import { ProductPreview } from "@/components/landing/product-preview";

export default function LandingPage() {
  return (
    <div className="ambient-ivory relative flex h-dvh min-h-[600px] flex-col overflow-hidden">
      {/* Ambient light: a soft champagne key light and a cool sage fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[70vh] w-[70vw] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(199 181 141 / 0.35), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[30%] -left-[10%] h-[60vh] w-[60vw] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgb(165 180 165 / 0.45), transparent)" }}
      />

      <LandingNav />

      <main className="relative flex min-h-0 flex-1 flex-col px-4 pb-3 pt-1 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-12 lg:px-12 lg:pb-6 xl:gap-16">
        <div className="shrink-0 lg:pb-6">
          <Hero />
        </div>
        <div className="mt-4 flex min-h-0 flex-1 items-start lg:mt-0 lg:flex-none lg:items-center">
          <div className="rise flex max-h-full w-full min-h-0" style={{ animationDelay: "160ms" }}>
            <ProductPreview />
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
