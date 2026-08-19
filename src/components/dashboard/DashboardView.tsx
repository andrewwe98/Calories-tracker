"use client";

import Link from "next/link";

import { MacroBars } from "@/components/charts/MacroBars";
import { WeeklyBars } from "@/components/charts/WeeklyBars";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { MealBreakdown } from "@/components/dashboard/MealBreakdown";
import { useShell } from "@/components/shell/shell-context";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState, StatCard } from "@/components/ui/Feedback";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { formatLongDate, lastNDays, todayKey } from "@/lib/date";
import { formatKcal, formatServings } from "@/lib/format";
import {
  dailySeries,
  entriesForDay,
  groupByMeal,
  loggingStreak,
  macroTargets,
  seriesSummary,
  sumNutrition,
} from "@/lib/selectors";
import { useEatMore } from "@/lib/store";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const { state, hydrated } = useEatMore();
  const { openAdd } = useShell();

  if (!hydrated) return <DashboardSkeleton />;

  const today = todayKey();
  const todayEntries = entriesForDay(state.entries, today);
  const totals = sumNutrition(todayEntries);
  const targets = macroTargets(state.goals);
  const goal = state.goals.calories;
  const remaining = goal - totals.kcal;
  const overGoal = remaining < 0;

  const week = dailySeries(state.entries, lastNDays(7, today));
  const summary = seriesSummary(week, goal);
  const streak = loggingStreak(state.entries, today);
  const byMeal = groupByMeal(todayEntries);

  const hello = state.name ? `${greeting(new Date().getHours())}, ${state.name}` : greeting(new Date().getHours());

  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm font-semibold text-ink-muted">{formatLongDate(today)}</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {hello}
        </h1>
      </header>

      <Card className="animate-rise">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <ProgressRing
            value={totals.kcal}
            goal={goal}
            label={`${formatKcal(totals.kcal)} of ${formatKcal(goal)} calories eaten today`}
            className="shrink-0"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {overGoal ? "Over by" : "Remaining"}
            </span>
            <span className="tabular font-display text-4xl font-extrabold leading-none text-ink">
              {formatKcal(Math.abs(remaining))}
            </span>
            <span className="mt-1 text-xs text-ink-muted">of {formatKcal(goal)} kcal</span>
          </ProgressRing>

          <div className="w-full space-y-4">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-hairline bg-surface-2 p-3 text-center">
              {[
                { label: "Eaten", value: totals.kcal },
                { label: "Goal", value: goal },
                { label: overGoal ? "Over" : "Left", value: Math.abs(remaining) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {item.label}
                  </p>
                  <p className="tabular font-display text-lg font-bold text-ink">
                    {formatKcal(item.value)}
                  </p>
                </div>
              ))}
            </div>

            <MacroBars totals={totals} targets={targets} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          emoji="🔥"
          accent="mango"
          label="Streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
          hint="in a row"
        />
        <StatCard
          emoji="📊"
          accent="grape"
          label="7-day avg"
          value={formatKcal(summary.average)}
          hint="per logged day"
        />
        <StatCard
          emoji="🎯"
          accent="kiwi"
          label="On target"
          value={`${summary.onTargetDays}/7`}
          hint="close to goal"
        />
        <StatCard
          emoji="🍽️"
          accent="berry"
          label="Logged today"
          value={`${todayEntries.length}`}
          hint={todayEntries.length === 1 ? "item" : "items"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Today by meal"
            hint="Tap plus to log straight into a meal"
          />
          <MealBreakdown
            byMeal={byMeal}
            dayTotalKcal={totals.kcal}
            onAddToMeal={(meal) => openAdd({ meal, dateKey: today })}
          />
        </Card>

        <Card>
          <CardHeader
            title="Last 7 days"
            hint={`${summary.daysLogged} of 7 days logged`}
            action={
              <Link
                href="/insights"
                className="text-sm font-semibold text-mango-600 hover:underline dark:text-mango-200"
              >
                Insights
              </Link>
            }
          />
          <WeeklyBars points={week} goal={goal} todayDateKey={today} />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Today's log"
          hint={todayEntries.length > 0 ? `${formatKcal(totals.kcal)} kcal so far` : undefined}
          action={
            <Link
              href="/log"
              className="text-sm font-semibold text-mango-600 hover:underline dark:text-mango-200"
            >
              Open diary
            </Link>
          }
        />

        {todayEntries.length === 0 ? (
          <EmptyState
            emoji="🍉"
            title="Nothing logged yet"
            description="Add your first bite of the day and watch the ring fill up."
            action={<Button onClick={() => openAdd({ dateKey: today })}>Log your first food</Button>}
          />
        ) : (
          <ul className="divide-y divide-hairline">
            {todayEntries
              .slice(-6)
              .reverse()
              .map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-2.5">
                  <span className="text-xl" aria-hidden="true">
                    {entry.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{entry.name}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {formatServings(entry.servings)} × {entry.serving}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-sm font-semibold text-ink-soft">
                    {formatKcal(entry.kcal * entry.servings)}
                    <span className="text-xs font-normal text-ink-muted"> kcal</span>
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
