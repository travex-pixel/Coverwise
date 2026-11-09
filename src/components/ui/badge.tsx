import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "border-line bg-white/70 text-muted",
        ink: "border-ink bg-ink text-ivory",
        forest: "border-forest/15 bg-forest/8 text-forest",
        champagne: "border-champagne-2/40 bg-champagne/25 text-champagne-3",
        success: "border-success/15 bg-success/8 text-success",
        warn: "border-warn/20 bg-warn/8 text-warn",
        danger: "border-danger/20 bg-danger/8 text-danger",
        glass: "border-white/15 bg-white/10 text-ivory/90",
      },
      size: {
        sm: "h-[20px] px-2 text-[11px]",
        md: "h-6 px-2.5 text-[12px]",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({ className, tone, size, dot, pulse, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot && (
        <span className={cn("size-1.5 rounded-full bg-current", pulse && "animate-pulse-dot")} aria-hidden />
      )}
      {children}
    </span>
  );
}
