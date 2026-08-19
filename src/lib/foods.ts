import type { FoodCategory, FoodItem } from "./types";

/**
 * A small offline food library so logging never needs a network request.
 * Values are per the stated serving and come from common USDA reference
 * figures, rounded to one decimal.
 */
export const FOODS: FoodItem[] = [
  // Fruit
  { id: "apple", name: "Apple", emoji: "🍎", serving: "1 medium (182 g)", category: "fruit", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: "banana", name: "Banana", emoji: "🍌", serving: "1 medium (118 g)", category: "fruit", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: "strawberries", name: "Strawberries", emoji: "🍓", serving: "1 cup (152 g)", category: "fruit", kcal: 49, protein: 1, carbs: 11.7, fat: 0.5 },
  { id: "blueberries", name: "Blueberries", emoji: "🫐", serving: "1 cup (148 g)", category: "fruit", kcal: 84, protein: 1.1, carbs: 21.5, fat: 0.5 },
  { id: "orange", name: "Orange", emoji: "🍊", serving: "1 medium (131 g)", category: "fruit", kcal: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },
  { id: "kiwi", name: "Kiwi", emoji: "🥝", serving: "1 fruit (69 g)", category: "fruit", kcal: 42, protein: 0.8, carbs: 10.1, fat: 0.4 },
  { id: "watermelon", name: "Watermelon", emoji: "🍉", serving: "1 cup diced (152 g)", category: "fruit", kcal: 46, protein: 0.9, carbs: 11.5, fat: 0.2 },
  { id: "grapes", name: "Grapes", emoji: "🍇", serving: "1 cup (151 g)", category: "fruit", kcal: 104, protein: 1.1, carbs: 27.3, fat: 0.2 },
  { id: "mango", name: "Mango", emoji: "🥭", serving: "1 cup sliced (165 g)", category: "fruit", kcal: 99, protein: 1.4, carbs: 24.7, fat: 0.6 },
  { id: "pineapple", name: "Pineapple", emoji: "🍍", serving: "1 cup chunks (165 g)", category: "fruit", kcal: 82, protein: 0.9, carbs: 21.6, fat: 0.2 },
  { id: "raspberries", name: "Raspberries", emoji: "🍒", serving: "1 cup (123 g)", category: "fruit", kcal: 64, protein: 1.5, carbs: 14.7, fat: 0.8 },
  { id: "cherries", name: "Cherries", emoji: "🍒", serving: "1 cup (154 g)", category: "fruit", kcal: 97, protein: 1.6, carbs: 24.7, fat: 0.3 },
  { id: "peach", name: "Peach", emoji: "🍑", serving: "1 medium (150 g)", category: "fruit", kcal: 59, protein: 1.4, carbs: 14.3, fat: 0.4 },
  { id: "pear", name: "Pear", emoji: "🍐", serving: "1 medium (178 g)", category: "fruit", kcal: 101, protein: 0.6, carbs: 27, fat: 0.2 },
  { id: "avocado", name: "Avocado", emoji: "🥑", serving: "1/2 fruit (100 g)", category: "fruit", kcal: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { id: "cantaloupe", name: "Cantaloupe", emoji: "🍈", serving: "1 cup (160 g)", category: "fruit", kcal: 54, protein: 1.3, carbs: 13, fat: 0.3 },
  { id: "lemon", name: "Lemon", emoji: "🍋", serving: "1 fruit (58 g)", category: "fruit", kcal: 17, protein: 0.6, carbs: 5.4, fat: 0.2 },
  { id: "plum", name: "Plum", emoji: "🍑", serving: "1 medium (66 g)", category: "fruit", kcal: 30, protein: 0.5, carbs: 7.5, fat: 0.2 },

  // Vegetables
  { id: "broccoli", name: "Broccoli", emoji: "🥦", serving: "1 cup (91 g)", category: "vegetable", kcal: 31, protein: 2.6, carbs: 6, fat: 0.3 },
  { id: "spinach", name: "Spinach", emoji: "🥬", serving: "2 cups raw (60 g)", category: "vegetable", kcal: 14, protein: 1.7, carbs: 2.2, fat: 0.2 },
  { id: "sweet-potato", name: "Sweet potato", emoji: "🍠", serving: "1 medium (130 g)", category: "vegetable", kcal: 112, protein: 2, carbs: 26, fat: 0.1 },
  { id: "carrot", name: "Carrot", emoji: "🥕", serving: "1 medium (61 g)", category: "vegetable", kcal: 25, protein: 0.6, carbs: 6, fat: 0.1 },
  { id: "bell-pepper", name: "Bell pepper", emoji: "🫑", serving: "1 medium (119 g)", category: "vegetable", kcal: 31, protein: 1, carbs: 7.2, fat: 0.4 },
  { id: "cherry-tomatoes", name: "Cherry tomatoes", emoji: "🍅", serving: "1 cup (149 g)", category: "vegetable", kcal: 27, protein: 1.3, carbs: 5.8, fat: 0.3 },
  { id: "cucumber", name: "Cucumber", emoji: "🥒", serving: "1 cup sliced (119 g)", category: "vegetable", kcal: 16, protein: 0.7, carbs: 3.8, fat: 0.1 },
  { id: "kale", name: "Kale", emoji: "🥬", serving: "1 cup (67 g)", category: "vegetable", kcal: 33, protein: 2.9, carbs: 6, fat: 0.6 },
  { id: "corn", name: "Corn on the cob", emoji: "🌽", serving: "1 ear (90 g)", category: "vegetable", kcal: 88, protein: 3.3, carbs: 19, fat: 1.4 },
  { id: "side-salad", name: "Garden salad", emoji: "🥗", serving: "1 bowl (150 g)", category: "vegetable", kcal: 45, protein: 2, carbs: 8, fat: 0.5 },

  // Protein
  { id: "chicken-breast", name: "Chicken breast", emoji: "🍗", serving: "100 g grilled", category: "protein", kcal: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "salmon", name: "Salmon fillet", emoji: "🐟", serving: "100 g", category: "protein", kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "egg", name: "Egg", emoji: "🥚", serving: "1 large (50 g)", category: "protein", kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { id: "greek-yogurt", name: "Greek yogurt, plain", emoji: "🥣", serving: "170 g cup", category: "protein", kcal: 100, protein: 17, carbs: 6, fat: 0.7 },
  { id: "tofu", name: "Tofu, firm", emoji: "🧈", serving: "100 g", category: "protein", kcal: 144, protein: 17, carbs: 3, fat: 9 },
  { id: "ground-beef", name: "Ground beef, 90/10", emoji: "🥩", serving: "100 g cooked", category: "protein", kcal: 176, protein: 20, carbs: 0, fat: 10 },
  { id: "tuna", name: "Tuna, canned in water", emoji: "🐟", serving: "100 g", category: "protein", kcal: 116, protein: 26, carbs: 0, fat: 0.8 },
  { id: "shrimp", name: "Shrimp", emoji: "🍤", serving: "100 g", category: "protein", kcal: 99, protein: 24, carbs: 0.2, fat: 0.3 },
  { id: "black-beans", name: "Black beans", emoji: "🫘", serving: "1 cup cooked (172 g)", category: "protein", kcal: 227, protein: 15, carbs: 41, fat: 0.9 },
  { id: "lentils", name: "Lentils", emoji: "🫘", serving: "1 cup cooked (198 g)", category: "protein", kcal: 230, protein: 18, carbs: 40, fat: 0.8 },
  { id: "turkey-breast", name: "Turkey breast", emoji: "🦃", serving: "100 g sliced", category: "protein", kcal: 104, protein: 17, carbs: 4, fat: 2 },
  { id: "cottage-cheese", name: "Cottage cheese", emoji: "🥣", serving: "1 cup (226 g)", category: "protein", kcal: 206, protein: 28, carbs: 8, fat: 4.5 },
  { id: "protein-shake", name: "Protein shake", emoji: "🥛", serving: "1 scoop in water", category: "protein", kcal: 120, protein: 24, carbs: 3, fat: 1.5 },

  // Grains
  { id: "oatmeal", name: "Oatmeal", emoji: "🥣", serving: "1 cup cooked (234 g)", category: "grain", kcal: 158, protein: 6, carbs: 27, fat: 3.2 },
  { id: "brown-rice", name: "Brown rice", emoji: "🍚", serving: "1 cup cooked (195 g)", category: "grain", kcal: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: "white-rice", name: "White rice", emoji: "🍚", serving: "1 cup cooked (186 g)", category: "grain", kcal: 205, protein: 4.3, carbs: 45, fat: 0.4 },
  { id: "whole-wheat-bread", name: "Whole wheat bread", emoji: "🍞", serving: "1 slice (43 g)", category: "grain", kcal: 81, protein: 4, carbs: 14, fat: 1.1 },
  { id: "bagel", name: "Bagel, plain", emoji: "🥯", serving: "1 medium (99 g)", category: "grain", kcal: 245, protein: 10, carbs: 48, fat: 1.5 },
  { id: "pasta", name: "Pasta", emoji: "🍝", serving: "1 cup cooked (140 g)", category: "grain", kcal: 221, protein: 8, carbs: 43, fat: 1.3 },
  { id: "quinoa", name: "Quinoa", emoji: "🍚", serving: "1 cup cooked (185 g)", category: "grain", kcal: 222, protein: 8, carbs: 39, fat: 3.6 },
  { id: "tortilla", name: "Flour tortilla", emoji: "🌮", serving: "1 x 8 in (49 g)", category: "grain", kcal: 146, protein: 4, carbs: 25, fat: 3.5 },
  { id: "granola", name: "Granola", emoji: "🥣", serving: "1/2 cup (61 g)", category: "grain", kcal: 224, protein: 5, carbs: 38, fat: 7 },

  // Dairy
  { id: "milk", name: "Milk, 2%", emoji: "🥛", serving: "1 cup (244 g)", category: "dairy", kcal: 122, protein: 8, carbs: 12, fat: 4.8 },
  { id: "cheddar", name: "Cheddar cheese", emoji: "🧀", serving: "28 g slice", category: "dairy", kcal: 113, protein: 7, carbs: 0.4, fat: 9.3 },
  { id: "almond-milk", name: "Almond milk, unsweetened", emoji: "🥛", serving: "1 cup (240 g)", category: "dairy", kcal: 39, protein: 1, carbs: 3.4, fat: 2.5 },
  { id: "butter", name: "Butter", emoji: "🧈", serving: "1 tbsp (14 g)", category: "dairy", kcal: 102, protein: 0.1, carbs: 0, fat: 11.5 },

  // Fats and nuts
  { id: "almonds", name: "Almonds", emoji: "🥜", serving: "28 g (23 nuts)", category: "fat", kcal: 164, protein: 6, carbs: 6.1, fat: 14.2 },
  { id: "peanut-butter", name: "Peanut butter", emoji: "🥜", serving: "2 tbsp (32 g)", category: "fat", kcal: 188, protein: 8, carbs: 6.9, fat: 16 },
  { id: "olive-oil", name: "Olive oil", emoji: "🫒", serving: "1 tbsp (14 g)", category: "fat", kcal: 119, protein: 0, carbs: 0, fat: 13.5 },
  { id: "walnuts", name: "Walnuts", emoji: "🥜", serving: "28 g", category: "fat", kcal: 185, protein: 4.3, carbs: 3.9, fat: 18.5 },
  { id: "chia-seeds", name: "Chia seeds", emoji: "🌱", serving: "1 tbsp (12 g)", category: "fat", kcal: 58, protein: 2, carbs: 5, fat: 3.7 },

  // Drinks
  { id: "orange-juice", name: "Orange juice", emoji: "🧃", serving: "1 cup (248 g)", category: "drink", kcal: 112, protein: 1.7, carbs: 26, fat: 0.5 },
  { id: "coffee", name: "Coffee, black", emoji: "☕", serving: "1 cup (240 ml)", category: "drink", kcal: 2, protein: 0.3, carbs: 0, fat: 0 },
  { id: "latte", name: "Latte", emoji: "☕", serving: "12 oz with 2% milk", category: "drink", kcal: 150, protein: 8, carbs: 13, fat: 7.5 },
  { id: "berry-smoothie", name: "Berry smoothie", emoji: "🥤", serving: "16 oz", category: "drink", kcal: 250, protein: 5, carbs: 52, fat: 3 },
  { id: "soda", name: "Cola", emoji: "🥤", serving: "12 oz can", category: "drink", kcal: 140, protein: 0, carbs: 39, fat: 0 },
  { id: "green-tea", name: "Green tea", emoji: "🍵", serving: "1 cup (240 ml)", category: "drink", kcal: 2, protein: 0, carbs: 0.5, fat: 0 },

  // Treats
  { id: "dark-chocolate", name: "Dark chocolate", emoji: "🍫", serving: "28 g", category: "treat", kcal: 170, protein: 2, carbs: 13, fat: 12 },
  { id: "ice-cream", name: "Ice cream", emoji: "🍨", serving: "1/2 cup (66 g)", category: "treat", kcal: 137, protein: 2.3, carbs: 16, fat: 7.3 },
  { id: "cookie", name: "Chocolate chip cookie", emoji: "🍪", serving: "1 cookie (30 g)", category: "treat", kcal: 148, protein: 1.7, carbs: 20, fat: 7 },
  { id: "croissant", name: "Croissant", emoji: "🥐", serving: "1 medium (57 g)", category: "treat", kcal: 231, protein: 5, carbs: 26, fat: 12 },
  { id: "potato-chips", name: "Potato chips", emoji: "🥔", serving: "28 g bag", category: "treat", kcal: 152, protein: 2, carbs: 15, fat: 10 },
  { id: "donut", name: "Glazed donut", emoji: "🍩", serving: "1 donut (60 g)", category: "treat", kcal: 269, protein: 4, carbs: 31, fat: 15 },

  // Full meals
  { id: "burrito-bowl", name: "Chicken burrito bowl", emoji: "🌯", serving: "1 bowl", category: "meal", kcal: 630, protein: 40, carbs: 65, fat: 22 },
  { id: "pizza-slice", name: "Margherita pizza", emoji: "🍕", serving: "1 slice", category: "meal", kcal: 285, protein: 12, carbs: 36, fat: 10 },
  { id: "cheeseburger", name: "Cheeseburger", emoji: "🍔", serving: "1 burger", category: "meal", kcal: 550, protein: 30, carbs: 42, fat: 28 },
  { id: "caesar-salad", name: "Caesar salad with chicken", emoji: "🥗", serving: "1 bowl", category: "meal", kcal: 470, protein: 33, carbs: 14, fat: 32 },
  { id: "sushi-roll", name: "Salmon avocado roll", emoji: "🍣", serving: "6 pieces", category: "meal", kcal: 304, protein: 13, carbs: 42, fat: 9 },
  { id: "pad-thai", name: "Pad thai", emoji: "🍜", serving: "1 plate", category: "meal", kcal: 750, protein: 28, carbs: 95, fat: 28 },
  { id: "turkey-sandwich", name: "Turkey sandwich", emoji: "🥪", serving: "1 sandwich", category: "meal", kcal: 380, protein: 24, carbs: 45, fat: 11 },
  { id: "overnight-oats", name: "Overnight oats with berries", emoji: "🥣", serving: "1 jar", category: "meal", kcal: 340, protein: 12, carbs: 55, fat: 9 },
];

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  fruit: "Fruit",
  vegetable: "Veg",
  protein: "Protein",
  grain: "Grains",
  dairy: "Dairy",
  fat: "Nuts & fats",
  drink: "Drinks",
  treat: "Treats",
  meal: "Meals",
};

export const FOOD_CATEGORIES = Object.keys(CATEGORY_LABELS) as FoodCategory[];

const FOODS_BY_ID = new Map(FOODS.map((food) => [food.id, food]));

export function getFood(id: string): FoodItem | undefined {
  return FOODS_BY_ID.get(id);
}

/**
 * Ranks name matches ahead of serving/category matches so typing "app" surfaces
 * Apple before Pineapple.
 */
export function searchFoods(query: string, category?: FoodCategory | "all"): FoodItem[] {
  const pool = !category || category === "all" ? FOODS : FOODS.filter((f) => f.category === category);
  const needle = query.trim().toLowerCase();
  if (!needle) return pool;

  const scored: { food: FoodItem; score: number }[] = [];
  for (const food of pool) {
    const name = food.name.toLowerCase();
    if (name.startsWith(needle)) scored.push({ food, score: 0 });
    else if (name.includes(needle)) scored.push({ food, score: 1 });
    else if (food.category.includes(needle) || food.serving.toLowerCase().includes(needle)) {
      scored.push({ food, score: 2 });
    }
  }

  return scored
    .sort((a, b) => a.score - b.score || a.food.name.localeCompare(b.food.name))
    .map((entry) => entry.food);
}
