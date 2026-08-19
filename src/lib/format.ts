const LOCALE = "en-US";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatKcal(value: number): string {
  return Math.round(value).toLocaleString(LOCALE);
}

/** Grams with one decimal below 10, whole numbers above, so bars stay narrow. */
export function formatGrams(value: number): string {
  if (value > 0 && value < 10) return value.toFixed(1);
  return Math.round(value).toLocaleString(LOCALE);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Trims trailing zeros so "1.00" reads as "1" and "0.50" as "0.5". */
export function formatServings(value: number): string {
  return Number.parseFloat(value.toFixed(2)).toString();
}

export function ratio(value: number, total: number): number {
  if (total <= 0) return 0;
  return value / total;
}
