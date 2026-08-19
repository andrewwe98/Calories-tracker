import { addDays, fromDateKey, weekdayShort } from "./date";
import {
  MACRO_KCAL_PER_GRAM,
  MACRO_KEYS,
  MEAL_TYPES,
  type Entry,
  type Goals,
  type MacroKey,
  type MealType,
  type Nutrition,
} from "./types";

export const EMPTY_NUTRITION: Nutrition = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export interface DayPoint {
  dateKey: string;
  kcal: number;
}

/** An entry stores per-serving values; totals scale by the serving count. */
export function entryTotals(entry: Entry): Nutrition {
  return {
    kcal: entry.kcal * entry.servings,
    protein: entry.protein * entry.servings,
    carbs: entry.carbs * entry.servings,
    fat: entry.fat * entry.servings,
  };
}

export function sumNutrition(entries: Entry[]): Nutrition {
  return entries.reduce<Nutrition>((total, entry) => {
    const { kcal, protein, carbs, fat } = entryTotals(entry);
    return {
      kcal: total.kcal + kcal,
      protein: total.protein + protein,
      carbs: total.carbs + carbs,
      fat: total.fat + fat,
    };
  }, EMPTY_NUTRITION);
}

export function entriesForDay(entries: Entry[], dateKey: string): Entry[] {
  return entries
    .filter((entry) => entry.dateKey === dateKey)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function dayTotals(entries: Entry[], dateKey: string): Nutrition {
  return sumNutrition(entriesForDay(entries, dateKey));
}

export function groupByMeal(entries: Entry[]): Record<MealType, Entry[]> {
  const grouped = {} as Record<MealType, Entry[]>;
  for (const meal of MEAL_TYPES) grouped[meal] = [];
  for (const entry of entries) grouped[entry.meal].push(entry);
  return grouped;
}

/** Converts the percentage split on `goals` into gram targets per macro. */
export function macroTargets(goals: Goals): Record<MacroKey, number> {
  const pct: Record<MacroKey, number> = {
    protein: goals.proteinPct,
    carbs: goals.carbsPct,
    fat: goals.fatPct,
  };

  const targets = {} as Record<MacroKey, number>;
  for (const macro of MACRO_KEYS) {
    targets[macro] = (goals.calories * (pct[macro] / 100)) / MACRO_KCAL_PER_GRAM[macro];
  }
  return targets;
}

export function kcalByDay(entries: Entry[]): Map<string, number> {
  const byDay = new Map<string, number>();
  for (const entry of entries) {
    byDay.set(entry.dateKey, (byDay.get(entry.dateKey) ?? 0) + entry.kcal * entry.servings);
  }
  return byDay;
}

export function dailySeries(entries: Entry[], dateKeys: string[]): DayPoint[] {
  const byDay = kcalByDay(entries);
  return dateKeys.map((dateKey) => ({ dateKey, kcal: byDay.get(dateKey) ?? 0 }));
}

/**
 * Consecutive days with at least one entry. A day with nothing logged yet does
 * not break the streak until it is over, so counting starts from yesterday when
 * today is still empty.
 */
export function loggingStreak(entries: Entry[], reference: string): number {
  const byDay = kcalByDay(entries);
  let cursor = byDay.has(reference) ? reference : addDays(reference, -1);
  let streak = 0;

  while (byDay.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface SeriesSummary {
  daysLogged: number;
  totalKcal: number;
  /** Mean over logged days only, so untouched days don't drag it down. */
  average: number;
  onTargetDays: number;
  highest: DayPoint | null;
  lowest: DayPoint | null;
}

/** A day counts as on target when it lands within 10% of the calorie goal. */
export function seriesSummary(points: DayPoint[], goalCalories: number): SeriesSummary {
  const logged = points.filter((point) => point.kcal > 0);
  const totalKcal = logged.reduce((sum, point) => sum + point.kcal, 0);
  const tolerance = goalCalories * 0.1;

  let highest: DayPoint | null = null;
  let lowest: DayPoint | null = null;
  let onTargetDays = 0;

  for (const point of logged) {
    if (!highest || point.kcal > highest.kcal) highest = point;
    if (!lowest || point.kcal < lowest.kcal) lowest = point;
    if (Math.abs(point.kcal - goalCalories) <= tolerance) onTargetDays += 1;
  }

  return {
    daysLogged: logged.length,
    totalKcal,
    average: logged.length ? totalKcal / logged.length : 0,
    onTargetDays,
    highest,
    lowest,
  };
}

export interface WeekdayAverage {
  label: string;
  average: number;
}

/** Average calories per weekday, Monday first, across every logged day. */
export function weekdayAverages(entries: Entry[]): WeekdayAverage[] {
  const totals = Array.from({ length: 7 }, () => ({ sum: 0, days: 0 }));
  const labels = Array.from({ length: 7 }, () => "");

  for (const [dateKey, kcal] of kcalByDay(entries)) {
    if (kcal <= 0) continue;
    // Shift Sunday (0) to the end so the week reads Monday -> Sunday.
    const jsDay = fromDateKey(dateKey).getDay();
    const index = (jsDay + 6) % 7;
    totals[index].sum += kcal;
    totals[index].days += 1;
    labels[index] = weekdayShort(dateKey);
  }

  const fallback = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return totals.map((bucket, i) => ({
    label: labels[i] || fallback[i],
    average: bucket.days ? bucket.sum / bucket.days : 0,
  }));
}

export interface MacroSplit {
  macro: MacroKey;
  grams: number;
  kcal: number;
  share: number;
}

/** Share of calories contributed by each macro across the given entries. */
export function macroSplit(entries: Entry[]): MacroSplit[] {
  const totals = sumNutrition(entries);
  const parts = MACRO_KEYS.map((macro) => ({
    macro,
    grams: totals[macro],
    kcal: totals[macro] * MACRO_KCAL_PER_GRAM[macro],
  }));

  const totalKcal = parts.reduce((sum, part) => sum + part.kcal, 0);
  return parts.map((part) => ({
    ...part,
    share: totalKcal > 0 ? part.kcal / totalKcal : 0,
  }));
}

export interface FoodTally {
  name: string;
  emoji: string;
  count: number;
  kcal: number;
}

export function topFoods(entries: Entry[], limit = 5): FoodTally[] {
  const tally = new Map<string, FoodTally>();

  for (const entry of entries) {
    const existing = tally.get(entry.name);
    const kcal = entry.kcal * entry.servings;
    if (existing) {
      existing.count += 1;
      existing.kcal += kcal;
    } else {
      tally.set(entry.name, { name: entry.name, emoji: entry.emoji, count: 1, kcal });
    }
  }

  return [...tally.values()].sort((a, b) => b.count - a.count || b.kcal - a.kcal).slice(0, limit);
}
