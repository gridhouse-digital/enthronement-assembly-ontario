import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex min-h-13 w-full rounded-xl border-[1.5px] border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text)] transition-all duration-200 placeholder:text-[var(--color-muted)] hover:border-[var(--color-gold-bright)] focus-visible:border-[var(--color-violet)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(155,81,224,0.16)] disabled:cursor-not-allowed disabled:bg-[var(--color-royal-tint)] disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
