import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-shimmer rounded-full bg-surface-sunken", className)} />;
}

export function EmptyState({
  emoji,
  title,
  description,
  action,
  className,
}: {
  emoji: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-10 text-center", className)}>
      <span className="mb-3 text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

const ACCENTS = {
  mango: "from-mango-200 to-mango-100 text-mango-700 dark:from-mango-700/40 dark:to-mango-800/30 dark:text-mango-100",
  berry: "from-berry-200 to-berry-100 text-berry-700 dark:from-berry-700/40 dark:to-berry-800/30 dark:text-berry-100",
  kiwi: "from-kiwi-200 to-kiwi-100 text-kiwi-700 dark:from-kiwi-700/40 dark:to-kiwi-800/30 dark:text-kiwi-100",
  grape: "from-grape-200 to-grape-100 text-grape-700 dark:from-grape-700/40 dark:to-grape-800/30 dark:text-grape-100",
  citrus: "from-citrus-200 to-citrus-100 text-citrus-700 dark:from-citrus-700/40 dark:to-citrus-800/30 dark:text-citrus-100",
} as const;

export type Accent = keyof typeof ACCENTS;

export function StatCard({
  emoji,
  label,
  value,
  hint,
  accent = "mango",
}: {
  emoji: string;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: Accent;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl border border-hairline p-3.5">
      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br text-xl",
          ACCENTS[accent],
        )}
      >
        {emoji}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="tabular font-display text-lg font-bold leading-tight text-ink">{value}</p>
        {hint ? <p className="truncate text-xs text-ink-muted">{hint}</p> : null}
      </div>
    </div>
  );
}
