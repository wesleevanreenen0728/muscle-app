import { rollingAverage, lastTwoWeekWindows } from './dateHelpers'

const ADJUSTMENT_STEP = 125 // kcal, mid-point of the 100-150 range requested

/**
 * Reviews the last ~14 days of weight (and optionally waist) data against the
 * user's weekly gain target and classifies the phase, with a plain-language
 * reason and a suggested new calorie target. Pure function — no side effects,
 * no writes. The caller decides whether to save/apply the suggestion.
 *
 * @param {Object} params
 * @param {Array}  params.weightEntries   [{ entry_date, weight_kg }]
 * @param {Array}  params.waistEntries    [{ entry_date, waist_cm }] (optional)
 * @param {number} params.currentCalorieTarget
 * @param {number} params.weeklyGainTargetKg  e.g. 0.2-0.3
 * @returns {Object|null} null if not enough data yet (needs 14 days of weigh-ins)
 */
export function evaluateSweetSpot({
  weightEntries,
  waistEntries = [],
  currentCalorieTarget,
  weeklyGainTargetKg,
}) {
  if (!weightEntries || weightEntries.length < 8) {
    return {
      phase: 'insufficient_data',
      reason: `You have ${weightEntries?.length ?? 0} weigh-ins logged. Keep weighing in each morning — the algorithm needs at least 8-14 days of data before it can make a reliable recommendation.`,
      newCalorieTarget: currentCalorieTarget,
      previousCalorieTarget: currentCalorieTarget,
      weeklyChangeKg: null,
    }
  }

  const withAvg = rollingAverage(
    weightEntries.map((e) => ({ entry_date: e.entry_date, value: e.weight_kg })),
    'value',
    7
  )
  const { thisWeek, prevWeek } = lastTwoWeekWindows(withAvg)

  const currentAvg = thisWeek[thisWeek.length - 1]?.avg
  const priorAvg = prevWeek.length > 0 ? prevWeek[prevWeek.length - 1]?.avg : withAvg[0]?.avg

  const weeklyChangeKg = Number((currentAvg - priorAvg).toFixed(2))

  // Tolerance band: within +/-40% of target counts as "on target"
  const lowerBound = weeklyGainTargetKg * 0.6
  const upperBound = weeklyGainTargetKg * 1.4

  // Optional waist signal: rapid waist gain alongside weight gain suggests
  // more of the surplus is going to fat than muscle.
  let waistFlag = false
  if (waistEntries.length >= 2) {
    const sortedWaist = [...waistEntries].sort((a, b) => a.entry_date.localeCompare(b.entry_date))
    const recentWaist = sortedWaist[sortedWaist.length - 1]
    const priorWaist = sortedWaist[Math.max(0, sortedWaist.length - 3)]
    const waistChange = recentWaist.waist_cm - priorWaist.waist_cm
    if (waistChange > 1.0) waistFlag = true
  }

  let phase, newCalorieTarget, reason

  if (weeklyChangeKg < lowerBound) {
    phase = 'too_little'
    newCalorieTarget = currentCalorieTarget + ADJUSTMENT_STEP
    reason = `Your 7-day average changed by ${weeklyChangeKg >= 0 ? '+' : ''}${weeklyChangeKg} kg this week, below your target of ~${weeklyGainTargetKg} kg/week. Increasing your target by ${ADJUSTMENT_STEP} kcal/day and reassessing next week.`
  } else if (weeklyChangeKg > upperBound || waistFlag) {
    phase = 'too_fast'
    newCalorieTarget = currentCalorieTarget - ADJUSTMENT_STEP
    const waistNote = waistFlag ? ' Your waist has also increased more than expected, suggesting some of this gain is fat rather than muscle.' : ''
    reason = `Your 7-day average increased by ${weeklyChangeKg} kg this week, above your target of ~${weeklyGainTargetKg} kg/week.${waistNote} Reducing your target by ${ADJUSTMENT_STEP} kcal/day and reassessing next week.`
  } else {
    phase = 'on_target'
    newCalorieTarget = currentCalorieTarget
    reason = `Your 7-day average changed by ${weeklyChangeKg >= 0 ? '+' : ''}${weeklyChangeKg} kg this week — right in your target range of ~${weeklyGainTargetKg} kg/week. Keeping calories unchanged.`
  }

  return {
    phase,
    reason,
    newCalorieTarget,
    previousCalorieTarget: currentCalorieTarget,
    weeklyChangeKg,
  }
}
