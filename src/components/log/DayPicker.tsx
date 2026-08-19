"use client";

import { IconChevronLeft, IconChevronRight } from "@/components/ui/icons";
import { addDays, formatLongDate, isFuture, relativeDayLabel, todayKey } from "@/lib/date";

export function DayPicker({
  dateKey,
  onChange,
}: {
  dateKey: string;
  onChange: (dateKey: string) => void;
}) {
  const today = todayKey();
  const nextDay = addDays(dateKey, 1);
  const canGoForward = !isFuture(nextDay, today);

  return (
    <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-hairline px-3 py-2.5">
      <div className="flex flex-1 items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(addDays(dateKey, -1))}
          aria-label="Previous day"
          className="grid size-10 shrink-0 place-items-center rounded-2xl border border-hairline text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
        >
          <IconChevronLeft className="size-5" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="font-display text-base font-bold leading-tight text-ink">
            {relativeDayLabel(dateKey, today)}
          </p>
          <p className="truncate text-xs text-ink-muted">{formatLongDate(dateKey)}</p>
        </div>

        <button
          type="button"
          onClick={() => onChange(nextDay)}
          disabled={!canGoForward}
          aria-label="Next day"
          className="grid size-10 shrink-0 place-items-center rounded-2xl border border-hairline text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-35"
        >
          <IconChevronRight className="size-5" />
        </button>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        <span className="sr-only sm:not-sr-only">Jump to</span>
        <input
          type="date"
          value={dateKey}
          max={today}
          onChange={(event) => onChange(event.target.value || today)}
          className="h-10 rounded-xl border border-hairline-strong bg-surface-solid/70 px-3 text-sm font-medium normal-case tracking-normal text-ink focus:border-mango-300"
        />
      </label>
    </div>
  );
}
