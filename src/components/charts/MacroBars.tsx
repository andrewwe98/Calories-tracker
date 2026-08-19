import { cn } from "@/lib/cn";
import { clamp, formatGrams } from "@/lib/format";
import {
  MACRO_KEYS,
  MACRO_LABELS,
  type MacroKey,
  type Nutrition,
} from "@/lib/types";

const BAR_FILL: Record<MacroKey, string> = {
  protein: "from-berry-300 to-berry-500",
  carbs: "from-mango-300 to-mango-500",
  fat: "from-grape-300 to-grape-500",
};

export function MacroBars({
  totals,
  targets,
  className,
}: {
  totals: Nutrition;
  targets: Record<MacroKey, number>;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3.5", className)}>
      {MACRO_KEYS.map((macro) => {
        const value = totals[macro];
        const target = targets[macro];
        const progress = clamp(target > 0 ? value / target : 0, 0, 1);

        return (
          <li key={macro}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold text-ink">{MACRO_LABELS[macro]}</span>
              <span className="tabular text-sm text-ink-muted">
                <span className="font-semibold text-ink-soft">{formatGrams(value)}</span> /{" "}
                {formatGrams(target)} g
              </span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-surface-sunken"
              role="progressbar"
              aria-label={`${MACRO_LABELS[macro]} progress`}
              aria-valuenow={Math.round(value)}
              aria-valuemin={0}
              aria-valuemax={Math.round(target)}
            >
              <div
                className={cn("h-full rounded-full bg-linear-to-r transition-[width] duration-700", BAR_FILL[macro])}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
