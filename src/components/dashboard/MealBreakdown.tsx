"use client";

import { IconPlus } from "@/components/ui/icons";
import { clamp, formatKcal } from "@/lib/format";
import { sumNutrition } from "@/lib/selectors";
import { MEAL_EMOJI, MEAL_LABELS, MEAL_TYPES, type Entry, type MealType } from "@/lib/types";

export function MealBreakdown({
  byMeal,
  dayTotalKcal,
  onAddToMeal,
}: {
  byMeal: Record<MealType, Entry[]>;
  dayTotalKcal: number;
  onAddToMeal: (meal: MealType) => void;
}) {
  return (
    <ul className="space-y-2">
      {MEAL_TYPES.map((meal) => {
        const entries = byMeal[meal];
        const kcal = sumNutrition(entries).kcal;
        const share = clamp(dayTotalKcal > 0 ? kcal / dayTotalKcal : 0, 0, 1);

        return (
          <li
            key={meal}
            className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-2 p-2.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-solid/70 text-xl" aria-hidden="true">
              {MEAL_EMOJI[meal]}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-ink">{MEAL_LABELS[meal]}</span>
                <span className="tabular shrink-0 text-sm font-semibold text-ink-soft">
                  {formatKcal(kcal)}
                  <span className="text-xs font-normal text-ink-muted"> kcal</span>
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-mango-300 to-berry-400 transition-[width] duration-700"
                    style={{ width: `${share * 100}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs text-ink-muted">
                  {entries.length === 0
                    ? "nothing yet"
                    : `${entries.length} item${entries.length === 1 ? "" : "s"}`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onAddToMeal(meal)}
              aria-label={`Add food to ${MEAL_LABELS[meal]}`}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-hairline-strong bg-surface-solid/70 text-ink-soft transition-colors hover:border-mango-300 hover:text-mango-600"
            >
              <IconPlus className="size-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
