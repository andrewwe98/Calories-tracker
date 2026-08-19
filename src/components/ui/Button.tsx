import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-linear-to-br from-mango-400 to-berry-400 text-white shadow-float hover:from-mango-300 hover:to-berry-300 active:scale-[0.98]",
  secondary:
    "border border-hairline-strong bg-surface-solid/70 text-ink hover:bg-surface-solid active:scale-[0.98]",
  ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink",
  danger:
    "border border-berry-200 bg-berry-50 text-berry-600 hover:bg-berry-100 active:scale-[0.98] dark:bg-berry-700/20 dark:text-berry-200",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 gap-1.5 rounded-xl px-3 text-sm",
  md: "h-11 gap-2 rounded-2xl px-4 text-sm",
  lg: "h-13 gap-2 rounded-2xl px-5 text-base",
};

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-45",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    />
  );
}
