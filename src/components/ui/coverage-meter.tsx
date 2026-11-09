import { cn } from "@/lib/utils";

/* Coverage breadth meter: five segments lit according to the score. */
export function CoverageMeter({
  score,
  tone = "light",
  className,
  showLabel = true,
}: {
  score: number;
  tone?: "light" | "dark";
  className?: string;
  showLabel?: boolean;
}) {
  const lit = Math.round((score / 100) * 5);
  return (
    <span className={cn("inline-flex items-center gap-2", className)} title={`Coverage breadth ${score}/100`}>
      <span className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-[6px] w-[10px] rounded-[2px] transition-colors",
              i < lit
                ? tone === "light"
                  ? "bg-forest"
                  : "bg-champagne"
                : tone === "light"
                  ? "bg-ink/10"
                  : "bg-white/12",
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span className={cn("text-[12px] tabular", tone === "light" ? "text-muted" : "text-ivory/60")}>
          {score}
          <span className="opacity-60">/100</span>
        </span>
      )}
    </span>
  );
}
