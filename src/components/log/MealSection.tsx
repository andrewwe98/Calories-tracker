"use client";

import { EntryRow } from "@/components/log/EntryRow";
import { Card } from "@/components/ui/Card";
import { IconPlus } from "@/components/ui/icons";
import { formatKcal } from "@/lib/format";
import { sumNutrition } from "@/lib/selectors";
import { MEAL_EMOJI, MEAL_LABELS, type Entry, type MealType } from "@/lib/types";

export function MealSection({
  meal,
  entries,
  onAdd,
  onChangeServings,
  onDelete,
}: {
  meal: MealType;
  entries: Entry[];
  onAdd: () => void;
  onChangeServings: (id: string, servings: number) => void;
  onDelete: (id: string) => void;
}) {
  const kcal = sumNutrition(entries).kcal;

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-sunken text-xl" aria-hidden="true">
          {MEAL_EMOJI[meal]}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-bold text-ink">{MEAL_LABELS[meal]}</h2>
          <p className="tabular text-xs text-ink-muted">
            {formatKcal(kcal)} kcal ·{" "}
            {entries.length === 0 ? "empty" : `${entries.length} item${entries.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add food to ${MEAL_LABELS[meal]}`}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-hairline-strong bg-surface-solid/70 px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-mango-300 hover:text-mango-600"
        >
          <IconPlus className="size-4" />
          Add
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-hairline-strong px-3 py-4 text-center text-sm text-ink-muted">
          Nothing here yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              onChangeServings={(servings) => onChangeServings(entry.id, servings)}
              onDelete={() => onDelete(entry.id)}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
