import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { Wash } from "@/components/ui/watercolour";

export default function NotFound() {
  return (
    <div className="ambient-ivory flex h-dvh flex-col">
      <header className="flex h-14 items-center px-4 sm:px-6">
        <Wordmark />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="surface-card relative max-w-[400px] overflow-hidden rounded-[16px] p-6 text-center">
          <Wash tone="sage" shape="pool" seed={16} opacity={0.35} className="absolute -left-14 -top-10 h-32 w-72" />
          <p className="relative font-mono text-[12px] text-muted-2">404</p>
          <p className="mt-1 text-[18px] font-medium tracking-[-0.015em]">That page doesn&apos;t exist.</p>
          <Button asChild className="mt-5">
            <Link href="/">Back to Coverwise</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
