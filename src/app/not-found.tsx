import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="ambient-ivory flex h-dvh flex-col">
      <header className="flex h-14 items-center px-4 sm:px-6">
        <Wordmark />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="surface-card max-w-[400px] rounded-[16px] p-6 text-center">
          <p className="font-mono text-[12px] text-muted-2">404</p>
          <p className="mt-1 text-[18px] font-medium tracking-[-0.015em]">That page doesn&apos;t exist.</p>
          <Button asChild className="mt-5">
            <Link href="/">Back to Coverwise</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
