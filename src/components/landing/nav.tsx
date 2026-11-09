import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { HowItWorksDialog } from "./how-it-works-dialog";
import { ProvidersDialog } from "./providers-dialog";
import { PrivacyDialog } from "./privacy-dialog";

export function LandingNav() {
  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between px-4 sm:h-16 sm:px-8 lg:px-12">
      <Wordmark />
      <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
        <HowItWorksDialog>
          <button className="rounded-md px-3 py-2 text-[14px] text-muted transition-colors hover:text-ink">
            How it works
          </button>
        </HowItWorksDialog>
        <ProvidersDialog>
          <button className="rounded-md px-3 py-2 text-[14px] text-muted transition-colors hover:text-ink">
            Providers
          </button>
        </ProvidersDialog>
        <PrivacyDialog>
          <button className="rounded-md px-3 py-2 text-[14px] text-muted transition-colors hover:text-ink">
            Privacy
          </button>
        </PrivacyDialog>
      </nav>
      <Button asChild size="sm" className="md:h-10 md:px-4">
        <Link href="/compare/vehicle">
          Compare my insurance
          <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden />
        </Link>
      </Button>
    </header>
  );
}
