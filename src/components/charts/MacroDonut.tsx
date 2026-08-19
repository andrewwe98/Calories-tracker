"use client";

import { formatGrams, formatPercent } from "@/lib/format";
import type { MacroSplit } from "@/lib/selectors";
import { MACRO_LABELS, type MacroKey } from "@/lib/types";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SEGMENT_COLOR: Record<MacroKey, string> = {
  protein: "var(--color-berry-400)",
  carbs: "var(--color-mango-400)",
  fat: "var(--color-grape-400)",
};

const LEGEND_DOT: Record<MacroKey, string> = {
  protein: "bg-berry-400",
  carbs: "bg-mango-400",
  fat: "bg-grape-400",
};

export function MacroDonut({ split }: { split: MacroSplit[] }) {
  const hasData = split.some((part) => part.share > 0);

  // Each arc starts where the previous one ended.
  let offset = 0;
  const segments = split.map((part) => {
    const segment = { ...part, offset };
    offset += part.share;
    return segment;
  });

  const dominant = [...split].sort((a, b) => b.share - a.share)[0];

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" role="img" aria-label="Share of calories by macro">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="var(--hairline-strong)" strokeWidth="13" />
          {hasData
            ? segments.map((segment) => (
                <circle
                  key={segment.macro}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  fill="none"
                  stroke={SEGMENT_COLOR[segment.macro]}
                  strokeWidth="13"
                  strokeDasharray={`${segment.share * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-segment.offset * CIRCUMFERENCE}
                />
              ))
            : null}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {hasData ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Mostly</span>
              <span className="font-display text-lg font-bold text-ink">
                {MACRO_LABELS[dominant.macro]}
              </span>
              <span className="tabular text-sm text-ink-muted">{formatPercent(dominant.share * 100)}</span>
            </>
          ) : (
            <span className="text-sm text-ink-muted">No data</span>
          )}
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {split.map((part) => (
          <li key={part.macro} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className={`size-2.5 rounded-full ${LEGEND_DOT[part.macro]}`} aria-hidden="true" />
              {MACRO_LABELS[part.macro]}
            </span>
            <span className="tabular text-sm text-ink-muted">
              {formatGrams(part.grams)} g · {formatPercent(part.share * 100)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
