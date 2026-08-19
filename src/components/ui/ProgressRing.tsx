"use client";

import { useId, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { clamp } from "@/lib/format";

export interface ProgressRingProps {
  value: number;
  goal: number;
  size?: number;
  thickness?: number;
  label: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Apple-Fitness-style ring. Anything past the goal draws a second lap in a
 * hotter colour on top of the full first lap, so overshooting stays legible
 * rather than silently capping at 100%.
 */
export function ProgressRing({
  value,
  goal,
  size = 208,
  thickness = 18,
  label,
  children,
  className,
}: ProgressRingProps) {
  const gradientId = useId();
  const overflowId = `${gradientId}-overflow`;

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = goal > 0 ? value / goal : 0;
  const firstLap = clamp(progress, 0, 1);
  const secondLap = clamp(progress - 1, 0, 1);

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-citrus-300)" />
            <stop offset="55%" stopColor="var(--color-mango-400)" />
            <stop offset="100%" stopColor="var(--color-berry-400)" />
          </linearGradient>
          <linearGradient id={overflowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-berry-400)" />
            <stop offset="100%" stopColor="var(--color-grape-500)" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth={thickness}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - firstLap)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />

        {secondLap > 0 ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${overflowId})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - secondLap)}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        ) : null}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
