"use client";

import { useEffect, useState } from "react";

import { useShell } from "@/components/shell/shell-context";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Feedback";
import { cn } from "@/lib/cn";
import { formatGrams, formatKcal } from "@/lib/format";
import { macroTargets } from "@/lib/selectors";
import { clampCalories, useEatMore } from "@/lib/store";
import { MACRO_KEYS, MACRO_LABELS, type Goals, type MacroKey } from "@/lib/types";

const CALORIE_PRESETS = [1500, 1800, 2000, 2200, 2500];

const SLIDER_ACCENT: Record<MacroKey, string> = {
  protein: "accent-berry-400",
  carbs: "accent-mango-400",
  fat: "accent-grape-400",
};

const PCT_KEY: Record<MacroKey, keyof Goals> = {
  protein: "proteinPct",
  carbs: "carbsPct",
  fat: "fatPct",
};

/**
 * Moving one macro slider pushes the difference onto the other two in
 * proportion to their current values, so the split always sums to 100%.
 */
function rebalance(goals: Goals, macro: MacroKey, nextValue: number): Partial<Goals> {
  const target = Math.min(Math.max(Math.round(nextValue), 10), 80);
  const others = MACRO_KEYS.filter((key) => key !== macro);
  const currentOthers = others.map((key) => goals[PCT_KEY[key]]);
  const othersTotal = currentOthers.reduce((sum, value) => sum + value, 0);
  const remaining = 100 - target;

  const shares =
    othersTotal > 0
      ? currentOthers.map((value) => (value / othersTotal) * remaining)
      : others.map(() => remaining / 2);

  const rounded = shares.map((value) => Math.round(value));
  // Push any rounding drift onto the last slider so the total stays exact.
  const drift = remaining - rounded.reduce((sum, value) => sum + value, 0);
  rounded[rounded.length - 1] += drift;

  const patch: Partial<Goals> = { [PCT_KEY[macro]]: target } as Partial<Goals>;
  others.forEach((key, index) => {
    Object.assign(patch, { [PCT_KEY[key]]: rounded[index] });
  });
  return patch;
}

export function SettingsView() {
  const { state, hydrated, actions } = useEatMore();
  const { notify } = useShell();

  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!confirmClear) return;
    const timer = window.setTimeout(() => setConfirmClear(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmClear]);

  if (!hydrated) return <SettingsSkeleton />;

  const targets = macroTargets(state.goals);

  const commitCalories = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    actions.setGoals({
      calories: Number.isFinite(parsed) ? clampCalories(parsed) : state.goals.calories,
    });
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Settings
        </h1>
        <p className="text-sm text-ink-muted">Tune your targets and manage your data.</p>
      </header>

      <Card>
        <CardHeader title="Your name" hint="Used for the greeting on Today" />
        <Field label="Name" htmlFor="display-name">
          <Input
            id="display-name"
            value={state.name}
            onChange={(event) => actions.setName(event.target.value)}
            placeholder="Andrew"
            autoComplete="given-name"
            maxLength={40}
          />
        </Field>
      </Card>

      <Card>
        <CardHeader title="Daily calorie goal" hint="Between 800 and 8,000 kcal" />

        <Field label="Calories" htmlFor="calorie-goal" hint="Applied when you leave the field">
          {/* Keyed on the stored goal so preset buttons reset the field. */}
          <Input
            key={state.goals.calories}
            id="calorie-goal"
            type="number"
            inputMode="numeric"
            min={800}
            max={8000}
            step={50}
            defaultValue={state.goals.calories}
            onBlur={(event) => commitCalories(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
              }
            }}
          />
        </Field>

        <div className="mt-3 flex flex-wrap gap-2">
          {CALORIE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => actions.setGoals({ calories: preset })}
              className={cn(
                "tabular rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
                preset === state.goals.calories
                  ? "bg-ink text-page"
                  : "border border-hairline bg-surface-solid/60 text-ink-soft hover:text-ink",
              )}
            >
              {formatKcal(preset)}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Macro split"
          hint="Percent of calories from each macro, always totalling 100%"
        />
        <ul className="space-y-4">
          {MACRO_KEYS.map((macro) => {
            const percent = state.goals[PCT_KEY[macro]];
            return (
              <li key={macro}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <label
                    htmlFor={`macro-${macro}`}
                    className="text-sm font-semibold text-ink"
                  >
                    {MACRO_LABELS[macro]}
                  </label>
                  <span className="tabular text-sm text-ink-muted">
                    {percent}% · {formatGrams(targets[macro])} g
                  </span>
                </div>
                <input
                  id={`macro-${macro}`}
                  type="range"
                  min={10}
                  max={80}
                  step={1}
                  value={percent}
                  onChange={(event) =>
                    actions.setGoals(rebalance(state.goals, macro, Number(event.target.value)))
                  }
                  className={cn("h-2 w-full cursor-pointer", SLIDER_ACCENT[macro])}
                />
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Data"
          hint="EatMore keeps everything in this browser — nothing is uploaded."
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              actions.loadSampleData();
              notify("Loaded three weeks of sample data");
            }}
          >
            Load sample data
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => {
              if (!confirmClear) {
                setConfirmClear(true);
                return;
              }
              actions.clearEverything();
              setConfirmClear(false);
              notify("All data cleared");
            }}
          >
            {confirmClear ? "Tap again to confirm" : "Clear everything"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Sample data replaces your current log. Clearing removes every entry and resets your
          goals.
        </p>
      </Card>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-40" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-3xl" />
      ))}
    </div>
  );
}
