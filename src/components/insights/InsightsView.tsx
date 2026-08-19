"use client";

import { useMemo, useState } from "react";

import { MacroDonut } from "@/components/charts/MacroDonut";
import { TrendChart } from "@/components/charts/TrendChart";
import { useShell } from "@/components/shell/shell-context";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState, Skeleton, StatCard } from "@/components/ui/Feedback";
import { Segmented } from "@/components/ui/Segmented";
import { formatShortDate, lastNDays, todayKey } from "@/lib/date";
import { clamp, formatKcal } from "@/lib/format";
import {
  dailySeries,
  macroSplit,
  seriesSummary,
  topFoods,
  weekdayAverages,
} from "@/lib/selectors";
import { useEatMore } from "@/lib/store";

const RANGES = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
] as const;

type RangeValue = (typeof RANGES)[number]["value"];

export function InsightsView() {
  const { state, hydrated } = useEatMore();
  const { openAdd } = useShell();
  const [range, setRange] = useState<RangeValue>("14");

  const days = Number.parseInt(range, 10);

  const data = useMemo(() => {
    const today = todayKey();
    const keys = lastNDays(days, today);
    const points = dailySeries(state.entries, keys);
    const window = new Set(keys);
    const entriesInRange = state.entries.filter((entry) => window.has(entry.dateKey));

    return {
      points,
      summary: seriesSummary(points, state.goals.calories),
      split: macroSplit(entriesInRange),
      weekdays: weekdayAverages(entriesInRange),
      favourites: topFoods(entriesInRange, 5),
      entryCount: entriesInRange.length,
    };
  }, [state.entries, state.goals.calories, days]);

  if (!hydrated) return <InsightsSkeleton />;

  const goal = state.goals.calories;
  const { points, summary, split, weekdays, favourites } = data;

  if (summary.daysLogged === 0) {
    return (
      <div className="space-y-4">
        <InsightsHeader range={range} onRangeChange={setRange} />
        <Card>
          <EmptyState
            emoji="🍇"
            title="No data to chart yet"
            description="Log a few days of food and your trends, macro split and favourites will show up here."
            action={<Button onClick={() => openAdd()}>Log some food</Button>}
          />
        </Card>
      </div>
    );
  }

  const peakWeekday = weekdays.reduce((best, day) => (day.average > best.average ? day : best));

  return (
    <div className="space-y-4">
      <InsightsHeader range={range} onRangeChange={setRange} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          emoji="📈"
          accent="mango"
          label="Daily average"
          value={formatKcal(summary.average)}
          hint="per logged day"
        />
        <StatCard
          emoji="🎯"
          accent="kiwi"
          label="On target"
          value={`${summary.onTargetDays}/${summary.daysLogged}`}
          hint="days near goal"
        />
        <StatCard
          emoji="🔺"
          accent="berry"
          label="Biggest day"
          value={summary.highest ? formatKcal(summary.highest.kcal) : "—"}
          hint={summary.highest ? formatShortDate(summary.highest.dateKey) : undefined}
        />
        <StatCard
          emoji="🥝"
          accent="grape"
          label="Days logged"
          value={`${summary.daysLogged}/${days}`}
          hint="in this range"
        />
      </div>

      <Card>
        <CardHeader
          title="Calories over time"
          hint={`Goal line at ${formatKcal(goal)} kcal`}
        />
        <TrendChart points={points} goal={goal} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Macro split" hint="Share of calories in this range" />
          <MacroDonut split={split} />
        </Card>

        <Card>
          <CardHeader
            title="By weekday"
            hint={`${peakWeekday.label} is your biggest day`}
          />
          <WeekdayAverages weekdays={weekdays} goal={goal} />
        </Card>
      </div>

      <Card>
        <CardHeader title="Most logged foods" hint="Your go-to picks in this range" />
        <ul className="divide-y divide-hairline">
          {favourites.map((food, index) => (
            <li key={food.name} className="flex items-center gap-3 py-2.5">
              <span className="tabular w-5 shrink-0 text-sm font-bold text-ink-muted">
                {index + 1}
              </span>
              <span className="text-xl" aria-hidden="true">
                {food.emoji}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {food.name}
              </span>
              <span className="tabular shrink-0 text-xs text-ink-muted">
                {food.count}× · {formatKcal(food.kcal)} kcal
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function InsightsHeader({
  range,
  onRangeChange,
}: {
  range: RangeValue;
  onRangeChange: (value: RangeValue) => void;
}) {
  return (
    <header className="space-y-3">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Insights
        </h1>
        <p className="text-sm text-ink-muted">Where your calories actually go.</p>
      </div>
      <Segmented
        label="Date range"
        options={RANGES.map((option) => ({ ...option }))}
        value={range}
        onChange={onRangeChange}
        className="sm:max-w-xs"
      />
    </header>
  );
}

function WeekdayAverages({
  weekdays,
  goal,
}: {
  weekdays: { label: string; average: number }[];
  goal: number;
}) {
  const peak = Math.max(goal, ...weekdays.map((day) => day.average)) || 1;

  return (
    <ul className="space-y-2.5">
      {weekdays.map((day) => {
        const width = clamp(day.average / peak, 0, 1);
        return (
          <li key={day.label} className="flex items-center gap-3">
            <span className="w-9 shrink-0 text-xs font-bold uppercase text-ink-muted">
              {day.label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full rounded-full bg-linear-to-r from-citrus-300 to-mango-400 transition-[width] duration-700"
                style={{ width: `${width * 100}%` }}
              />
            </div>
            <span className="tabular w-14 shrink-0 text-right text-xs font-semibold text-ink-soft">
              {day.average > 0 ? formatKcal(day.average) : "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-44" />
      <Skeleton className="h-12 w-full max-w-xs rounded-2xl" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-3xl" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}
