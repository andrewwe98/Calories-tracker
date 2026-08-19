export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type FoodCategory =
  | "fruit"
  | "vegetable"
  | "protein"
  | "grain"
  | "dairy"
  | "fat"
  | "drink"
  | "treat"
  | "meal";

/** Calories and macros. On a `FoodItem` or `Entry` these describe one serving. */
export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem extends Nutrition {
  id: string;
  name: string;
  emoji: string;
  serving: string;
  category: FoodCategory;
}

/** The nutrition facts carried from the picker into the add-entry form. */
export type PickedFood = Pick<
  FoodItem,
  "name" | "emoji" | "serving" | "kcal" | "protein" | "carbs" | "fat"
>;

export interface Entry extends Nutrition {
  id: string;
  /** Local calendar day, `YYYY-MM-DD`. */
  dateKey: string;
  meal: MealType;
  name: string;
  emoji: string;
  serving: string;
  servings: number;
  createdAt: number;
}

export interface Goals {
  calories: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface AppState {
  version: number;
  name: string;
  goals: Goals;
  entries: Entry[];
}

export const MEAL_TYPES: readonly MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

export const MEAL_EMOJI: Record<MealType, string> = {
  breakfast: "🥝",
  lunch: "🥗",
  dinner: "🍽️",
  snack: "🍓",
};

export const MACRO_KEYS = ["protein", "carbs", "fat"] as const;

export type MacroKey = (typeof MACRO_KEYS)[number];

export const MACRO_LABELS: Record<MacroKey, string> = {
  protein: "Protein",
  carbs: "Carbs",
  fat: "Fat",
};

/** Calories per gram, used to convert a percentage split into gram targets. */
export const MACRO_KCAL_PER_GRAM: Record<MacroKey, number> = {
  protein: 4,
  carbs: 4,
  fat: 9,
};

export const DEFAULT_GOALS: Goals = {
  calories: 2000,
  proteinPct: 30,
  carbsPct: 45,
  fatPct: 25,
};
