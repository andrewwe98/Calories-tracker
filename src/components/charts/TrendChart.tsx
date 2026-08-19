"use client";

import { useId } from "react";

import { formatKcal } from "@/lib/format";
import { formatShortDate } from "@/lib/date";
import type { DayPoint } from "@/lib/selectors";

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 10;
const PAD_Y = 18;

interface Point {
  x: number;
  y: number;
}

/**
 * Catmull-Rom control points converted to cubic beziers, which keeps the line
 * smooth without overshooting past the data the way a naive spline does.
 */
function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  const tension = 0.2;
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const previous = points[i - 1] ?? points[i];
    const current = points[i];
    const next = points[i + 1];
    const following = points[i + 2] ?? next;

    const c1x = current.x + (next.x - previous.x) * tension;
    const c1y = current.y + (next.y - previous.y) * tension;
    const c2x = next.x - (following.x - current.x) * tension;
    const c2y = next.y - (following.y - current.y) * tension;

    path += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${next.x} ${next.y}`;
  }

  return path;
}

export function TrendChart({ points, goal }: { points: DayPoint[]; goal: number }) {
  const gradientId = useId();

  const peak = Math.max(goal, ...points.map((point) => point.kcal));
  const scale = peak * 1.15 || 1;

  const toX = (index: number) =>
    PAD_X + (index * (WIDTH - PAD_X * 2)) / Math.max(points.length - 1, 1);
  const toY = (value: number) => HEIGHT - PAD_Y - (value / scale) * (HEIGHT - PAD_Y * 2);

  const coords = points.map((point, index) => ({ x: toX(index), y: toY(point.kcal) }));
  const line = smoothPath(coords);
  const area =
    coords.length > 0
      ? `${line} L ${coords[coords.length - 1].x} ${HEIGHT - PAD_Y} L ${coords[0].x} ${HEIGHT - PAD_Y} Z`
      : "";

  const goalY = toY(goal);
  const labelStep = Math.max(1, Math.ceil(points.length / 6));

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Daily calories over ${points.length} days, against a goal of ${formatKcal(goal)} calories`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mango-400)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-mango-400)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          x1={PAD_X}
          y1={goalY}
          x2={WIDTH - PAD_X}
          y2={goalY}
          stroke="var(--ink-muted)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.6"
        />

        {area ? <path d={area} fill={`url(#${gradientId})`} /> : null}

        <path
          d={line}
          fill="none"
          stroke="var(--color-mango-500)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((coord, index) => (
          <circle
            key={points[index].dateKey}
            cx={coord.x}
            cy={coord.y}
            r={points.length > 20 ? 3 : 4.5}
            fill="var(--surface-solid)"
            stroke={points[index].kcal > goal ? "var(--color-berry-500)" : "var(--color-mango-500)"}
            strokeWidth="2.5"
          />
        ))}
      </svg>

      <div className="mt-1 flex justify-between text-[0.7rem] font-medium text-ink-muted">
        {points
          .filter((_, index) => index % labelStep === 0 || index === points.length - 1)
          .map((point) => (
            <span key={point.dateKey}>{formatShortDate(point.dateKey)}</span>
          ))}
      </div>
    </div>
  );
}
