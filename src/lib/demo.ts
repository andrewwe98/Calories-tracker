import { addDays, fromDateKey, todayKey } from "./date";
import { getFood } from "./foods";
import type { Entry, MealType } from "./types";

/**
 * Deterministic sample log, so "load sample data" in Settings always produces
 * the same three weeks and screenshots stay reproducible.
 */

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const MEAL_PLAN: Record<MealType, { hour: number; count: [number, number]; pool: string[] }> = {
  breakfast: {
    hour: 8,
    count: [2, 3],
    pool: ["oatmeal", "granola", "egg", "greek-yogurt", "banana", "blueberries", "coffee", "latte", "whole-wheat-bread", "overnight-oats", "strawberries", "orange-juice"],
  },
  lunch: {
    hour: 12,
    count: [2, 3],
    pool: ["turkey-sandwich", "caesar-salad", "burrito-bowl", "sushi-roll", "side-salad", "chicken-breast", "brown-rice", "apple", "cherry-tomatoes", "black-beans", "quinoa"],
  },
  dinner: {
    hour: 19,
    count: [2, 3],
    pool: ["salmon", "chicken-breast", "pasta", "pad-thai", "pizza-slice", "cheeseburger", "broccoli", "sweet-potato", "quinoa", "tofu", "brown-rice"],
  },
  snack: {
    hour: 16,
    count: [1, 2],
    pool: ["almonds", "dark-chocolate", "apple", "cookie", "greek-yogurt", "grapes", "watermelon", "peanut-butter", "kiwi", "mango", "ice-cream"],
  },
};

const SERVING_CHOICES = [1, 1, 1, 1, 0.5, 1.5, 2];
const DAYS = 21;

/** Two older gaps keep the charts honest without breaking the current streak. */
const SKIPPED_OFFSETS = new Set([13, 18]);

export function buildDemoEntries(reference: string = todayKey()): Entry[] {
  const random = mulberry32(0x4ea7);
  const entries: Entry[] = [];

  for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
    if (SKIPPED_OFFSETS.has(offset)) continue;
    const dateKey = addDays(reference, -offset);

    for (const meal of Object.keys(MEAL_PLAN) as MealType[]) {
      const { hour, count, pool } = MEAL_PLAN[meal];
      if (meal === "snack" && random() < 0.25) continue;

      const [min, max] = count;
      const items = min + Math.floor(random() * (max - min + 1));
      const used = new Set<string>();

      for (let i = 0; i < items; i += 1) {
        const foodId = pool[Math.floor(random() * pool.length)];
        if (used.has(foodId)) continue;
        used.add(foodId);

        const food = getFood(foodId);
        if (!food) continue;

        const at = fromDateKey(dateKey);
        at.setHours(hour, i * 11, 0, 0);

        entries.push({
          id: `demo-${dateKey}-${meal}-${i}`,
          dateKey,
          meal,
          name: food.name,
          emoji: food.emoji,
          serving: food.serving,
          servings: SERVING_CHOICES[Math.floor(random() * SERVING_CHOICES.length)],
          kcal: food.kcal,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          createdAt: at.getTime(),
        });
      }
    }
  }

  return entries;
}
