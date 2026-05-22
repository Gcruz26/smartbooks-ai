// components/ui/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-navy-800 text-white hover:bg-navy-700 shadow-sm focus-visible:ring-navy-500",
  secondary:
    "bg-sky-500 text-white hover:bg-sky-600 shadow-sm focus-visible:ring-sky-400",
  outline:
    "border border-slate-300 text-navy-800 bg-white hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-900 dark:text-slate-100 dark:hover:bg-navy-800",
  ghost:
    "text-navy-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-navy-800",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-4 text-base",
  md: "h-12 px-6 text-lg",
  lg: "h-14 px-8 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-navy-950",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
