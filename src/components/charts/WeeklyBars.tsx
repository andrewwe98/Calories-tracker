import { cn } from "@/lib/cn";
import { formatKcal } from "@/lib/format";
import { weekdayInitial } from "@/lib/date";
import type { DayPoint } from "@/lib/selectors";

export function WeeklyBars({
  points,
  goal,
  todayDateKey,
}: {
  points: DayPoint[];
  goal: number;
  todayDateKey: string;
}) {
  const peak = Math.max(goal, ...points.map((point) => point.kcal));
  // Headroom keeps the tallest bar and the goal line clear of the top edge.
  const scale = peak * 1.12 || 1;

  const summary = points
    .map((point) => `${weekdayInitial(point.dateKey)} ${formatKcal(point.kcal)}`)
    .join(", ");

  return (
    <div>
      <div
        className="relative flex h-40 items-end gap-1.5 sm:gap-2.5"
        role="img"
        aria-label={`Calories over the last ${points.length} days: ${summary}`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-ink-muted/50"
          style={{ bottom: `${(goal / scale) * 100}%` }}
        >
          <span className="absolute -top-5 right-0 rounded-full bg-surface-sunken px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-muted">
            goal
          </span>
        </div>

        {points.map((point) => {
          const height = (point.kcal / scale) * 100;
          const isToday = point.dateKey === todayDateKey;
          const overGoal = point.kcal > goal;

          return (
            <div key={point.dateKey} className="flex h-full flex-1 flex-col justify-end">
              <div
                className={cn(
                  "w-full rounded-t-lg bg-linear-to-t transition-[height] duration-700",
                  point.kcal === 0 && "bg-surface-sunken",
                  point.kcal > 0 && !overGoal && "from-mango-300 to-citrus-300",
                  overGoal && "from-berry-400 to-mango-300",
                  isToday && "ring-2 ring-ink/20",
                )}
                style={{ height: `${Math.max(height, point.kcal > 0 ? 3 : 1.5)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-1.5 sm:gap-2.5">
        {points.map((point) => (
          <span
            key={point.dateKey}
            className={cn(
              "flex-1 text-center text-[0.7rem] font-semibold",
              point.dateKey === todayDateKey ? "text-ink" : "text-ink-muted",
            )}
          >
            {weekdayInitial(point.dateKey)}
          </span>
        ))}
      </div>
    </div>
  );
}
