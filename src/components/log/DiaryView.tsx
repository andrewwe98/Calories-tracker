"use client";

import { useState } from "react";

import { MacroBars } from "@/components/charts/MacroBars";
import { DayPicker } from "@/components/log/DayPicker";
import { MealSection } from "@/components/log/MealSection";
import { useShell } from "@/components/shell/shell-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";
import { IconPlus } from "@/components/ui/icons";
import { todayKey } from "@/lib/date";
import { clamp, formatKcal } from "@/lib/format";
import { entriesForDay, groupByMeal, macroTargets, sumNutrition } from "@/lib/selectors";
import { useEatMore } from "@/lib/store";
import { MEAL_TYPES } from "@/lib/types";

export function DiaryView() {
  const { state, hydrated, actions } = useEatMore();
  const { openAdd } = useShell();
  const [dateKey, setDateKey] = useState(() => todayKey());

  if (!hydrated) return <DiarySkeleton />;

  const entries = entriesForDay(state.entries, dateKey);
  const byMeal = groupByMeal(entries);
  const totals = sumNutrition(entries);
  const targets = macroTargets(state.goals);
  const goal = state.goals.calories;
  const remaining = goal - totals.kcal;
  const progress = clamp(goal > 0 ? totals.kcal / goal : 0, 0, 1);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Diary
          </h1>
          <p className="text-sm text-ink-muted">Every bite, meal by meal.</p>
        </div>
        <Button onClick={() => openAdd({ dateKey })} className="hidden sm:inline-flex">
          <IconPlus className="size-5" />
          Log food
        </Button>
      </header>

      <DayPicker dateKey={dateKey} onChange={setDateKey} />

      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <div className="sm:w-56 sm:shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Total for the day
            </p>
            <p className="tabular font-display text-4xl font-extrabold leading-tight text-ink">
              {formatKcal(totals.kcal)}
              <span className="ml-1 text-base font-semibold text-ink-muted">
                / {formatKcal(goal)}
              </span>
            </p>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full rounded-full bg-linear-to-r from-mango-300 to-berry-400 transition-[width] duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              {remaining >= 0
                ? `${formatKcal(remaining)} kcal remaining`
                : `${formatKcal(-remaining)} kcal over goal`}
            </p>
          </div>

          <MacroBars totals={totals} targets={targets} className="flex-1" />
        </div>
      </Card>

      <div className="space-y-3">
        {MEAL_TYPES.map((meal) => (
          <MealSection
            key={meal}
            meal={meal}
            entries={byMeal[meal]}
            onAdd={() => openAdd({ meal, dateKey })}
            onChangeServings={(id, servings) => actions.updateEntry(id, { servings })}
            onDelete={(id) => actions.deleteEntry(id)}
          />
        ))}
      </div>
    </div>
  );
}

function DiarySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-40 w-full rounded-3xl" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-3xl" />
      ))}
    </div>
  );
}
