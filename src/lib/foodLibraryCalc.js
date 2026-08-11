/**
 * Scales a food_items row's per-100g nutrition to an actual gram amount.
 */
export function scaleFoodToGrams(food, grams) {
  const factor = grams / 100
  return {
    calories: round1(food.calories_per_100g * factor),
    protein_g: round1(food.protein_per_100g * factor),
    carbs_g: round1(food.carbs_per_100g * factor),
    fat_g: round1(food.fat_per_100g * factor),
    fibre_g: round1(food.fibre_per_100g * factor),
  }
}

/**
 * Converts a "3 eggs" style quantity into grams, using the food's unit weight.
 * Falls back to treating the quantity as grams directly if the food has no
 * defined unit weight.
 */
export function unitsToGrams(food, units) {
  if (food.unit_weight_g) return units * food.unit_weight_g
  return units
}

function round1(n) {
  return Math.round(n * 10) / 10
}
