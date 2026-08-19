"use client";

import { useId, useState } from "react";

import { IconTrash } from "@/components/ui/icons";
import { formatGrams, formatKcal, formatServings } from "@/lib/format";
import { entryTotals } from "@/lib/selectors";
import type { Entry } from "@/lib/types";

const MIN_SERVINGS = 0.25;

export function EntryRow({
  entry,
  onChangeServings,
  onDelete,
}: {
  entry: Entry;
  onChangeServings: (servings: number) => void;
  onDelete: () => void;
}) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const totals = entryTotals(entry);

  const step = (delta: number) => {
    const next = Math.max(MIN_SERVINGS, Math.round((entry.servings + delta) * 4) / 4);
    onChangeServings(next);
  };

  return (
    <li className="rounded-2xl border border-hairline bg-surface-2 transition-colors hover:border-hairline-strong">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 rounded-2xl p-3 text-left"
      >
        <span className="text-xl" aria-hidden="true">
          {entry.emoji}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">{entry.name}</span>
          <span className="tabular block truncate text-xs text-ink-muted">
            {formatServings(entry.servings)} × {entry.serving} · P {formatGrams(totals.protein)} · C{" "}
            {formatGrams(totals.carbs)} · F {formatGrams(totals.fat)}
          </span>
        </span>

        <span className="tabular shrink-0 text-right text-sm font-bold text-ink">
          {formatKcal(totals.kcal)}
          <span className="block text-[0.65rem] font-normal text-ink-muted">kcal</span>
        </span>
      </button>

      {expanded ? (
        <div
          id={panelId}
          className="flex items-center justify-between gap-3 border-t border-hairline px-3 py-2.5"
        >
          <div className="flex items-center gap-1.5">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Servings
            </span>
            <button
              type="button"
              onClick={() => step(-0.5)}
              aria-label={`Decrease servings of ${entry.name}`}
              className="grid size-8 place-items-center rounded-lg border border-hairline-strong bg-surface-solid font-bold text-ink-soft transition-colors hover:text-ink"
            >
              −
            </button>
            <span className="tabular w-10 text-center text-sm font-bold text-ink">
              {formatServings(entry.servings)}
            </span>
            <button
              type="button"
              onClick={() => step(0.5)}
              aria-label={`Increase servings of ${entry.name}`}
              className="grid size-8 place-items-center rounded-lg border border-hairline-strong bg-surface-solid font-bold text-ink-soft transition-colors hover:text-ink"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-berry-200 bg-berry-50 px-2.5 py-1.5 text-xs font-semibold text-berry-600 transition-colors hover:bg-berry-100 dark:border-berry-700/50 dark:bg-berry-800/25 dark:text-berry-200"
          >
            <IconTrash className="size-4" />
            Remove
          </button>
        </div>
      ) : null}
    </li>
  );
}
