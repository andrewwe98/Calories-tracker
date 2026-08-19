/**
 * Date helpers built around a `YYYY-MM-DD` "date key" in the user's local
 * timezone. Keys are never parsed with `new Date(string)`, which would treat
 * them as UTC and shift the day for anyone west of Greenwich.
 *
 * Every `Intl` call pins an explicit locale so server and client renders agree.
 */

const LOCALE = "en-US";

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, amount: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  const ms = fromDateKey(to).getTime() - fromDateKey(from).getTime();
  return Math.round(ms / 86_400_000);
}

/** `count` keys ending at `endKey` (inclusive), oldest first. */
export function lastNDays(count: number, endKey: string): string[] {
  return Array.from({ length: count }, (_, i) => addDays(endKey, i - (count - 1)));
}

export function isFuture(key: string, reference = todayKey()): boolean {
  return daysBetween(reference, key) > 0;
}

export function formatLongDate(key: string): string {
  return fromDateKey(key).toLocaleDateString(LOCALE, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(key: string): string {
  return fromDateKey(key).toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
}

export function weekdayShort(key: string): string {
  return fromDateKey(key).toLocaleDateString(LOCALE, { weekday: "short" });
}

export function weekdayInitial(key: string): string {
  return weekdayShort(key).slice(0, 1);
}

/** "Today" / "Yesterday" / "Tomorrow" where it applies, otherwise a short date. */
export function relativeDayLabel(key: string, reference = todayKey()): string {
  const delta = daysBetween(reference, key);
  if (delta === 0) return "Today";
  if (delta === -1) return "Yesterday";
  if (delta === 1) return "Tomorrow";
  return formatShortDate(key);
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
  });
}
