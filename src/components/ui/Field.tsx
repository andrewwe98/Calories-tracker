import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

const CONTROL_BASE =
  "w-full rounded-2xl border border-hairline-strong bg-surface-solid/70 px-4 text-ink transition-colors placeholder:text-ink-muted focus:border-mango-300 focus:bg-surface-solid";

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...rest }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(CONTROL_BASE, "h-12", className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<"select">) {
  return (
    <select className={cn(CONTROL_BASE, "h-12 appearance-none pr-10", className)} {...rest}>
      {children}
    </select>
  );
}
