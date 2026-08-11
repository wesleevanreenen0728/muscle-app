// Calorie & macro calculation logic.
// Uses the Mifflin-St Jeor equation for BMR (well-validated, simple to reason about).

const ACTIVITY_MULTIPLIERS = {
  low: 1.375, // light home training + some walking
  moderate: 1.55, // consistent home training + regular walking/running
  active: 1.725, // frequent training + running
}

/**
 * Basal Metabolic Rate (calories/day at complete rest).
 */
export function calculateBMR({ sex, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

/**
 * Total Daily Energy Expenditure = BMR * activity multiplier.
 */
export function calculateTDEE({ sex, weightKg, heightCm, age, activityLevel }) {
  const bmr = calculateBMR({ sex, weightKg, heightCm, age })
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? ACTIVITY_MULTIPLIERS.low
  return bmr * multiplier
}

/**
 * A conservative muscle-gain calorie target: TDEE + a modest surplus.
 * ~300-350 kcal surplus is enough to support ~0.2-0.3 kg/week gain for
 * most people without excessive fat gain. This is only a STARTING POINT —
 * the weekly "sweet spot" algorithm should adjust it based on real results.
 */
export function calculateStartingCalorieTarget(profile) {
  const tdee = calculateTDEE(profile)
  const surplus = 325
  return Math.round((tdee + surplus) / 10) * 10 // round to nearest 10
}

/**
 * Macro split from a calorie target and bodyweight.
 * Protein: ~1.8-2.0 g/kg bodyweight (sensible muscle-building range, not maximal).
 * Fat: minimum ~0.8 g/kg for hormonal health, capped at a reasonable share of calories.
 * Carbs: remainder.
 */
export function calculateMacroTargets({ calorieTarget, weightKg }) {
  const proteinG = Math.round(weightKg * 1.9)
  const proteinCals = proteinG * 4

  const fatG = Math.max(Math.round(weightKg * 0.9), 60)
  const fatCals = fatG * 9

  const remainingCals = Math.max(calorieTarget - proteinCals - fatCals, 0)
  const carbsG = Math.round(remainingCals / 4)

  const fibreG = Math.round((calorieTarget / 1000) * 14) // ~14g per 1000 kcal
  const waterMl = Math.round(weightKg * 35) // ~35ml per kg bodyweight

  return { proteinG, fatG, carbsG, fibreG, waterMl }
}
