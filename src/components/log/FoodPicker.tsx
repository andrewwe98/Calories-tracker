"use client";

import { useId, useMemo, useState } from "react";

import { IconSearch } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { CATEGORY_LABELS, FOOD_CATEGORIES, searchFoods } from "@/lib/foods";
import { formatKcal } from "@/lib/format";
import { useEatMore } from "@/lib/store";
import type { FoodCategory, PickedFood } from "@/lib/types";

const RESULT_LIMIT = 60;

export function FoodPicker({
  value,
  onChange,
}: {
  value: PickedFood | null;
  onChange: (food: PickedFood) => void;
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const { state } = useEatMore();

  const results = useMemo(
    () => searchFoods(query, category).slice(0, RESULT_LIMIT),
    [query, category],
  );

  // Most recent distinct foods the user actually logged, newest first.
  const recents = useMemo(() => {
    const seen = new Map<string, PickedFood>();
    for (const entry of [...state.entries].sort((a, b) => b.createdAt - a.createdAt)) {
      if (seen.has(entry.name)) continue;
      seen.set(entry.name, {
        name: entry.name,
        emoji: entry.emoji,
        serving: entry.serving,
        kcal: entry.kcal,
        protein: entry.protein,
        carbs: entry.carbs,
        fat: entry.fat,
      });
      if (seen.size >= 8) break;
    }
    return [...seen.values()];
  }, [state.entries]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search foods, meals, drinks…"
          aria-label="Search the food library"
          className="h-12 w-full rounded-2xl border border-hairline-strong bg-surface-solid/70 pl-11 pr-4 text-ink transition-colors placeholder:text-ink-muted focus:border-mango-300 focus:bg-surface-solid"
        />
      </div>

      {recents.length > 0 && !query ? (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Recent
          </p>
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {recents.map((food) => (
              <button
                key={food.name}
                type="button"
                onClick={() => onChange(food)}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-hairline bg-surface-solid/70 py-1.5 pl-2.5 pr-3 text-sm font-medium text-ink transition-colors hover:border-mango-300"
              >
                <span aria-hidden="true">{food.emoji}</span>
                {food.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        role="group"
        aria-label="Filter by category"
        className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1"
      >
        {(["all", ...FOOD_CATEGORIES] as const).map((option) => {
          const active = option === category;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(option)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-ink text-page"
                  : "border border-hairline bg-surface-solid/60 text-ink-soft hover:text-ink",
              )}
            >
              {option === "all" ? "All" : CATEGORY_LABELS[option]}
            </button>
          );
        })}
      </div>

      <ul className="max-h-64 space-y-1.5 overflow-y-auto rounded-2xl border border-hairline bg-surface-2 p-1.5">
        {results.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-ink-muted">
            Nothing matched “{query}”. Switch to Custom to enter it by hand.
          </li>
        ) : (
          results.map((food) => {
            const selected = value?.name === food.name && value?.serving === food.serving;
            return (
              <li key={food.id}>
                <button
                  type="button"
                  onClick={() => onChange(food)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                    selected
                      ? "bg-linear-to-r from-mango-100 to-berry-100 ring-2 ring-mango-300 dark:from-mango-700/40 dark:to-berry-700/30"
                      : "hover:bg-surface-solid/70",
                  )}
                >
                  <span className="text-xl" aria-hidden="true">
                    {food.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {food.name}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">{food.serving}</span>
                  </span>
                  <span className="tabular shrink-0 text-sm font-semibold text-ink-soft">
                    {formatKcal(food.kcal)}
                    <span className="text-xs font-normal text-ink-muted"> kcal</span>
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
