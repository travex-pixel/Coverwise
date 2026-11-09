import { cn } from "@/lib/utils";
import type { ProviderDefinition } from "@/lib/providers/types";

/* Generated monogram marks for fictional demonstration providers.
   Each is a letter on a tinted, lit surface so the roster reads as a
   set without borrowing any real insurer's branding. */
export function ProviderMark({
  provider,
  size = "md",
  className,
}: {
  provider: Pick<ProviderDefinition, "accentHue" | "monogram" | "name">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const h = provider.accentHue;
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden font-semibold tracking-tight text-white",
        size === "sm" && "size-7 rounded-[7px] text-[12px]",
        size === "md" && "size-9 rounded-[9px] text-[14px]",
        size === "lg" && "size-11 rounded-[11px] text-[17px]",
        className,
      )}
      style={{
        background: `linear-gradient(145deg, oklch(0.42 0.06 ${h}) 0%, oklch(0.26 0.05 ${h}) 100%)`,
        boxShadow: `inset 0 1px 0 0 rgb(255 255 255 / 0.22), inset 0 -1px 0 0 rgb(0 0 0 / 0.2), 0 1px 2px rgb(17 21 18 / 0.2)`,
      }}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent" />
      <span className="relative">{provider.monogram}</span>
    </span>
  );
}
