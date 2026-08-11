// Starter food library. All values are per 100g (approximate, standard
// nutrition-database figures) — the user can edit any of them once they
// check an actual package, and can add their own foods too.
//
// unit_weight_g / unit_label let a food be logged as "1 egg" instead of
// grams. Foods without a natural whole-unit (like rice) omit these.

export const SEED_FOODS = [
  // --- Staples ---
  { name: 'Oats (dry, rolled)', calories_per_100g: 379, protein_per_100g: 13.2, carbs_per_100g: 67.7, fat_per_100g: 6.5, fibre_per_100g: 10.1 },
  { name: 'Rice (dry, white)', calories_per_100g: 365, protein_per_100g: 7.1, carbs_per_100g: 80, fat_per_100g: 0.7, fibre_per_100g: 1.3 },
  { name: 'Pasta (dry)', calories_per_100g: 371, protein_per_100g: 13, carbs_per_100g: 74.7, fat_per_100g: 1.5, fibre_per_100g: 3.2 },
  { name: 'Potatoes (raw)', calories_per_100g: 77, protein_per_100g: 2, carbs_per_100g: 17.5, fat_per_100g: 0.1, fibre_per_100g: 2.2 },
  { name: 'Bread (white)', calories_per_100g: 265, protein_per_100g: 9, carbs_per_100g: 49, fat_per_100g: 3.2, fibre_per_100g: 2.7, unit_label: 'slice', unit_weight_g: 30 },
  { name: 'Bread (wholegrain)', calories_per_100g: 247, protein_per_100g: 13, carbs_per_100g: 41, fat_per_100g: 4.2, fibre_per_100g: 7, unit_label: 'slice', unit_weight_g: 35 },

  // --- Protein ---
  { name: 'Eggs (whole)', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11, fibre_per_100g: 0, unit_label: 'egg', unit_weight_g: 50 },
  { name: 'Chicken breast (raw)', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6, fibre_per_100g: 0, unit_label: 'chicken breast', unit_weight_g: 250 },
  { name: 'Chicken thigh (raw)', calories_per_100g: 209, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 10.9, fibre_per_100g: 0 },
  { name: 'Minced beef (5% fat)', calories_per_100g: 137, protein_per_100g: 21, carbs_per_100g: 0, fat_per_100g: 5, fibre_per_100g: 0 },
  { name: 'Salmon (raw)', calories_per_100g: 208, protein_per_100g: 20, carbs_per_100g: 0, fat_per_100g: 13, fibre_per_100g: 0 },
  { name: 'Tuna (canned in water)', calories_per_100g: 116, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 0.8, fibre_per_100g: 0 },

  // --- Dairy ---
  { name: 'Milk (whole)', calories_per_100g: 61, protein_per_100g: 3.2, carbs_per_100g: 4.8, fat_per_100g: 3.3, fibre_per_100g: 0 },
  { name: 'Milk (skimmed)', calories_per_100g: 34, protein_per_100g: 3.4, carbs_per_100g: 5, fat_per_100g: 0.1, fibre_per_100g: 0 },
  { name: 'Kohupiim (curd cheese)', calories_per_100g: 98, protein_per_100g: 18, carbs_per_100g: 3.5, fat_per_100g: 1.5, fibre_per_100g: 0 },
  { name: 'Skyr', calories_per_100g: 63, protein_per_100g: 11, carbs_per_100g: 4, fat_per_100g: 0.2, fibre_per_100g: 0 },
  { name: 'Cottage cheese', calories_per_100g: 98, protein_per_100g: 11, carbs_per_100g: 3.4, fat_per_100g: 4.3, fibre_per_100g: 0 },
  { name: 'Greek yoghurt', calories_per_100g: 97, protein_per_100g: 9, carbs_per_100g: 4, fat_per_100g: 5, fibre_per_100g: 0 },
  { name: 'Cheddar cheese', calories_per_100g: 402, protein_per_100g: 25, carbs_per_100g: 1.3, fat_per_100g: 33, fibre_per_100g: 0 },

  // --- Fruit & veg ---
  { name: 'Banana', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 22.8, fat_per_100g: 0.3, fibre_per_100g: 2.6, unit_label: 'banana', unit_weight_g: 118 },
  { name: 'Apple', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 13.8, fat_per_100g: 0.2, fibre_per_100g: 2.4, unit_label: 'apple', unit_weight_g: 180 },
  { name: 'Frozen mixed vegetables', calories_per_100g: 65, protein_per_100g: 3, carbs_per_100g: 12, fat_per_100g: 0.5, fibre_per_100g: 4 },
  { name: 'Broccoli', calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4, fibre_per_100g: 2.6 },

  // --- Legumes / other ---
  { name: 'Beans (canned, drained)', calories_per_100g: 127, protein_per_100g: 8.7, carbs_per_100g: 21, fat_per_100g: 0.5, fibre_per_100g: 6.3 },
  { name: 'Lentils (cooked)', calories_per_100g: 116, protein_per_100g: 9, carbs_per_100g: 20, fat_per_100g: 0.4, fibre_per_100g: 7.9 },
  { name: 'Peanut butter', calories_per_100g: 588, protein_per_100g: 25, carbs_per_100g: 20, fat_per_100g: 50, fibre_per_100g: 6 },
  { name: 'Whey protein powder', calories_per_100g: 380, protein_per_100g: 78, carbs_per_100g: 6, fat_per_100g: 5, fibre_per_100g: 1, unit_label: 'scoop (30g)', unit_weight_g: 30 },
  { name: 'Olive oil', calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100, fibre_per_100g: 0 },
]
