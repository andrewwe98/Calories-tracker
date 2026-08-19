"use client";

import { useMemo, useState } from "react";

import { FoodPicker } from "@/components/log/FoodPicker";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Segmented } from "@/components/ui/Segmented";
import { formatGrams, formatKcal, formatServings } from "@/lib/format";
import { useEatMore } from "@/lib/store";
import { MEAL_LABELS, MEAL_TYPES, type MealType, type PickedFood } from "@/lib/types";
import { todayKey } from "@/lib/date";

type Mode = "library" | "custom";

const MEAL_OPTIONS = MEAL_TYPES.map((meal) => ({ value: meal, label: MEAL_LABELS[meal] }));

const EMPTY_CUSTOM = {
  name: "",
  serving: "1 serving",
  kcal: "",
  protein: "",
  carbs: "",
  fat: "",
};

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export function AddEntryForm({
  initialMeal = "breakfast",
  initialDateKey,
  onSubmitted,
}: {
  initialMeal?: MealType;
  initialDateKey?: string;
  onSubmitted: (message: string) => void;
}) {
  const { actions } = useEatMore();

  const [mode, setMode] = useState<Mode>("library");
  const [meal, setMeal] = useState<MealType>(initialMeal);
  const [dateKey, setDateKey] = useState(initialDateKey ?? todayKey());
  const [picked, setPicked] = useState<PickedFood | null>(null);
  const [custom, setCustom] = useState(EMPTY_CUSTOM);
  const [servingsText, setServingsText] = useState("1");

  const servings = useMemo(() => {
    const parsed = Number.parseFloat(servingsText);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [servingsText]);

  const food: PickedFood | null = useMemo(() => {
    if (mode === "library") return picked;
    const name = custom.name.trim();
    const kcal = toNumber(custom.kcal);
    if (!name || kcal <= 0) return null;
    return {
      name,
      emoji: "🍽️",
      serving: custom.serving.trim() || "1 serving",
      kcal,
      protein: toNumber(custom.protein),
      carbs: toNumber(custom.carbs),
      fat: toNumber(custom.fat),
    };
  }, [mode, picked, custom]);

  const canSubmit = food !== null && servings > 0;

  const totals = food
    ? {
        kcal: food.kcal * servings,
        protein: food.protein * servings,
        carbs: food.carbs * servings,
        fat: food.fat * servings,
      }
    : { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  const adjustServings = (delta: number) => {
    const base = servings > 0 ? servings : 1;
    const next = Math.max(0.25, Math.round((base + delta) * 4) / 4);
    setServingsText(formatServings(next));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!food || servings <= 0) return;

    actions.addEntry({ ...food, dateKey, meal, servings });
    onSubmitted(`${food.emoji} ${food.name} added to ${MEAL_LABELS[meal].toLowerCase()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Segmented
        label="Meal"
        options={MEAL_OPTIONS}
        value={meal}
        onChange={setMeal}
        className="text-xs"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date" htmlFor="entry-date">
          <Input
            id="entry-date"
            type="date"
            value={dateKey}
            max={todayKey()}
            onChange={(event) => setDateKey(event.target.value || todayKey())}
          />
        </Field>
        <Field label="Entry type">
          <Segmented
            label="Entry type"
            options={[
              { value: "library", label: "Library" },
              { value: "custom", label: "Custom" },
            ]}
            value={mode}
            onChange={(next: Mode) => setMode(next)}
            className="h-12"
          />
        </Field>
      </div>

      {mode === "library" ? (
        <FoodPicker value={picked} onChange={setPicked} />
      ) : (
        <div className="space-y-3">
          <Field label="Food name" htmlFor="custom-name">
            <Input
              id="custom-name"
              value={custom.name}
              onChange={(event) => setCustom({ ...custom, name: event.target.value })}
              placeholder="Grandma's peach cobbler"
              autoComplete="off"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Serving" htmlFor="custom-serving">
              <Input
                id="custom-serving"
                value={custom.serving}
                onChange={(event) => setCustom({ ...custom, serving: event.target.value })}
                placeholder="1 slice"
                autoComplete="off"
              />
            </Field>
            <Field label="Calories" htmlFor="custom-kcal" hint="Per serving">
              <Input
                id="custom-kcal"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                value={custom.kcal}
                onChange={(event) => setCustom({ ...custom, kcal: event.target.value })}
                placeholder="320"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Protein" htmlFor="custom-protein">
              <Input
                id="custom-protein"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={custom.protein}
                onChange={(event) => setCustom({ ...custom, protein: event.target.value })}
                placeholder="g"
              />
            </Field>
            <Field label="Carbs" htmlFor="custom-carbs">
              <Input
                id="custom-carbs"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={custom.carbs}
                onChange={(event) => setCustom({ ...custom, carbs: event.target.value })}
                placeholder="g"
              />
            </Field>
            <Field label="Fat" htmlFor="custom-fat">
              <Input
                id="custom-fat"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={custom.fat}
                onChange={(event) => setCustom({ ...custom, fat: event.target.value })}
                placeholder="g"
              />
            </Field>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 -mx-5 border-t border-hairline bg-surface-solid/85 px-5 pb-1 pt-3 backdrop-blur-md">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Servings
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustServings(-0.5)}
                aria-label="Decrease servings"
                className="grid size-9 place-items-center rounded-xl border border-hairline-strong bg-surface-solid text-lg font-bold text-ink-soft transition-colors hover:text-ink"
              >
                −
              </button>
              <input
                type="text"
                inputMode="decimal"
                value={servingsText}
                onChange={(event) => setServingsText(event.target.value)}
                aria-label="Servings"
                className="tabular h-9 w-14 rounded-xl border border-hairline-strong bg-surface-solid text-center font-semibold text-ink focus:border-mango-300"
              />
              <button
                type="button"
                onClick={() => adjustServings(0.5)}
                aria-label="Increase servings"
                className="grid size-9 place-items-center rounded-xl border border-hairline-strong bg-surface-solid text-lg font-bold text-ink-soft transition-colors hover:text-ink"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="tabular font-display text-2xl font-bold leading-none text-ink">
              {formatKcal(totals.kcal)}
              <span className="ml-1 text-sm font-semibold text-ink-muted">kcal</span>
            </p>
            <p className="tabular mt-1 text-xs text-ink-muted">
              P {formatGrams(totals.protein)} · C {formatGrams(totals.carbs)} · F{" "}
              {formatGrams(totals.fat)}
            </p>
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth disabled={!canSubmit} className="mt-3">
          {food ? `Add ${food.name}` : "Pick a food to continue"}
        </Button>
      </div>
    </form>
  );
}
