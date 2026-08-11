import { rollingAverage } from './dateHelpers'

/**
 * Computes the dashboard's weight-progress summary block:
 * current weight, gained so far, remaining to target, average weekly
 * change, and a naive linear projection to the target date.
 */
export function computeWeightSummary({ weightEntries, startingWeightKg, targetWeightKg, targetDate }) {
  const sorted = [...(weightEntries ?? [])].sort((a, b) => a.entry_date.localeCompare(b.entry_date))

  if (sorted.length === 0) {
    return {
      currentWeight: startingWeightKg,
      gained: 0,
      remaining: targetWeightKg - startingWeightKg,
      avgWeeklyChangeKg: null,
      projectedWeightAtTarget: null,
    }
  }

  const withAvg = rollingAverage(
    sorted.map((e) => ({ entry_date: e.entry_date, value: e.weight_kg })),
    'value',
    7
  )
  const currentWeight = withAvg[withAvg.length - 1].avg
  const gained = Number((currentWeight - startingWeightKg).toFixed(2))
  const remaining = Number((targetWeightKg - currentWeight).toFixed(2))

  // Average weekly change: compare current 7-day avg to the 7-day avg ~7 days ago
  let avgWeeklyChangeKg = null
  if (withAvg.length >= 8) {
    const weekAgoIndex = Math.max(0, withAvg.length - 8)
    avgWeeklyChangeKg = Number((currentWeight - withAvg[weekAgoIndex].avg).toFixed(3))
  }

  let projectedWeightAtTarget = null
  if (avgWeeklyChangeKg !== null && targetDate) {
    const today = new Date()
    const target = new Date(targetDate)
    const weeksRemaining = Math.max(0, (target - today) / (1000 * 60 * 60 * 24 * 7))
    projectedWeightAtTarget = Number((currentWeight + avgWeeklyChangeKg * weeksRemaining).toFixed(1))
  }

  return { currentWeight, gained, remaining, avgWeeklyChangeKg, projectedWeightAtTarget }
}
