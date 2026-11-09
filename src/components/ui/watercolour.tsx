import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Watercolour accents: translucent pigment washes with ragged edges and
   paper grain, built from SVG filters so they stay crisp, tiny and
   offline. Used sparingly behind editorial moments; never under data.
------------------------------------------------------------------- */

type Tone = "sage" | "champagne" | "forest" | "silver";

const TONE: Record<Tone, string> = {
  sage: "#A5B4A5",
  champagne: "#C7B58D",
  forest: "#14241D",
  silver: "#D7DAD5",
};

export function Wash({
  tone = "sage",
  className,
  opacity = 0.5,
  seed = 3,
  shape = "blob",
}: {
  tone?: Tone;
  className?: string;
  opacity?: number;
  seed?: number;
  shape?: "blob" | "stroke" | "pool";
}) {
  const reactId = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = `wash-${reactId}-${seed}`;
  const d =
    shape === "stroke"
      ? "M20 110 C120 70 260 72 380 86 C470 96 560 92 600 112 C560 134 470 140 380 136 C260 132 120 140 20 126 Z"
      : shape === "pool"
        ? "M60 60 C180 20 380 24 520 70 C600 98 596 170 520 198 C380 240 180 236 70 196 C10 170 8 96 60 60 Z"
        : "M90 40 C220 10 420 30 530 90 C600 130 580 210 490 230 C380 254 170 238 80 190 C20 158 24 70 90 40 Z";
  return (
    <svg
      viewBox="0 0 620 260"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("pointer-events-none select-none", className)}
      style={{ opacity }}
    >
      <defs>
        <filter id={`${id}-bleed`} x="-20%" y="-30%" width="140%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed={seed} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="46" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed + 1} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.3 0 0 0 0 0.3 0 0 0 0 0.26 0 0 0 -0.4 0.35" />
        </filter>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={TONE[tone]} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={TONE[tone]} stopOpacity="0.55" />
          <stop offset="1" stopColor={TONE[tone]} stopOpacity="0.85" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
      </defs>
      <g filter={`url(#${id}-bleed)`}>
        <path d={d} fill={`url(#${id}-g)`} />
        <path d={d} fill="none" stroke={TONE[tone]} strokeOpacity="0.5" strokeWidth="3" />
      </g>
      <rect width="620" height="260" clipPath={`url(#${id}-clip)`} filter={`url(#${id}-grain)`} style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}

/* Paper grain overlay for a whole surface. */
export function PaperGrain({ className, opacity = 0.35 }: { className?: string; opacity?: number }) {
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} style={{ opacity, mixBlendMode: "multiply" }}>
      <filter id="paper-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.42 0 0 0 0 0.4 0 0 0 0 0.34 0 0 0 -0.55 0.5" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}
