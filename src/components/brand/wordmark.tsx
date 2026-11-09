import Link from "next/link";
import { cn } from "@/lib/utils";

/* The Coverwise mark: two overlapping rounded forms — one application,
   many providers converging into a single view. */
export function Mark({ className, tone = "ink" }: { className?: string; tone?: "ink" | "ivory" }) {
  const fg = tone === "ink" ? "#111512" : "#F5F3ED";
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden fill="none">
      <defs>
        <linearGradient id="cw-mark-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C7B58D" />
          <stop offset="1" stopColor="#8F7C4F" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="26" height="26" rx="8" fill={fg} />
      <path
        d="M10.5 16.5c0-3.4 2.7-6.1 6.1-6.1 1.8 0 3.4.8 4.5 2"
        stroke="url(#cw-mark-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M21.5 15.5c0 3.4-2.7 6.1-6.1 6.1-1.8 0-3.4-.8-4.5-2"
        stroke={tone === "ink" ? "#F5F3ED" : "#111512"}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  tone = "ink",
  href = "/",
  compact,
}: {
  className?: string;
  tone?: "ink" | "ivory";
  href?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 rounded-md", className)}
      aria-label="Coverwise home"
    >
      <Mark tone={tone} />
      {!compact && (
        <span
          className={cn(
            "text-[17px] font-semibold tracking-[-0.03em]",
            tone === "ink" ? "text-ink" : "text-ivory",
          )}
        >
          Coverwise
        </span>
      )}
    </Link>
  );
}
