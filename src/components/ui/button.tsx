import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[transform,background-color,border-color,box-shadow,color,opacity] duration-(--dur-fast) ease-(--ease-out)",
    "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-ink text-ivory",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.14),0_1px_2px_rgb(17_21_18/0.2),0_8px_20px_-8px_rgb(17_21_18/0.45)]",
          "hover:bg-ink-2 hover:shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_1px_2px_rgb(17_21_18/0.2),0_12px_28px_-8px_rgb(17_21_18/0.5)]",
        ],
        secondary: [
          "bg-paper text-ink border border-line-strong/80",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),0_1px_2px_rgb(17_21_18/0.05)]",
          "hover:border-ink/30 hover:bg-white",
        ],
        ghost: "text-ink hover:bg-ink/5",
        subtle: "bg-ink/6 text-ink hover:bg-ink/10",
        champagne: [
          "bg-champagne text-ink",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.5),0_1px_2px_rgb(17_21_18/0.15),0_8px_20px_-8px_rgb(143_124_79/0.6)]",
          "hover:bg-[#d2c29f]",
        ],
        inverse: [
          "bg-ivory text-ink",
          "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.9),0_1px_2px_rgb(0_0_0/0.3)]",
          "hover:bg-white",
        ],
        link: "text-ink underline-offset-4 hover:underline h-auto px-0",
      },
      size: {
        sm: "h-9 rounded-[8px] px-3 text-[13px]",
        md: "h-11 rounded-(--radius-control) px-4 text-[14px]",
        lg: "h-12 rounded-[12px] px-5 text-[15px]",
        xl: "h-[52px] rounded-[13px] px-6 text-[15px]",
        icon: "size-10 rounded-(--radius-control)",
        "icon-sm": "size-8 rounded-[8px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            <span className="sr-only">Working</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
