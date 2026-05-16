import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 ease-[var(--ease)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(155,81,224,0.22)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-secondary)] text-white shadow-[var(--shadow-md)] hover:-translate-y-0.5 hover:bg-[var(--color-violet)] hover:shadow-[0_14px_34px_rgba(155,81,224,0.34)]",
        gold: "bg-[var(--color-primary)] text-[var(--color-royal-deep)] shadow-[var(--shadow-gold)] hover:-translate-y-0.5 hover:bg-[var(--color-gold-bright)]",
        outline:
          "border-[1.5px] border-[var(--color-secondary)] bg-transparent text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white",
      },
      size: {
        default: "h-12",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
