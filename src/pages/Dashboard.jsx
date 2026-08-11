import { useMemo } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useDailyEntries } from '../hooks/useDailyEntries'
import { useFoodLog } from '../hooks/useFoodLog'
import { computeWeightSummary } from '../lib/projections'
import { evaluateSweetSpot } from '../lib/sweetSpot'
import { toISODate } from '../lib/dateHelpers'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import WeightChart from '../components/WeightChart'

const PHASE_LABEL = {
  too_little: { text: 'Gaining too slowly', color: 'text-warn' },
  on_target: { text: 'On target', color: 'text-accent' },
  too_fast: { text: 'Gaining too fast', color: 'text-warn' },
  insufficient_data: { text: 'Still collecting data', color: 'text-text-dim' },
}

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile()
  const { entries: weightEntries, loading: weightLoading } = useDailyEntries('weight_entries')
  const { entries: waistEntries } = useDailyEntries('waist_entries')
  const today = toISODate(new Date())
  const { totals: foodTotals } = useFoodLog(today)

  const summary = useMemo(() => {
    if (!profile) return null
    return computeWeightSummary({
      weightEntries,
      startingWeightKg: profile.starting_weight_kg,
      targetWeightKg: profile.target_weight_kg,
      targetDate: profile.target_date,
    })
  }, [profile, weightEntries])

  const sweetSpot = useMemo(() => {
    if (!profile) return null
    return evaluateSweetSpot({
      weightEntries,
      waistEntries,
      currentCalorieTarget: profile.calorie_target,
      weeklyGainTargetKg: profile.weekly_gain_target_kg,
    })
  }, [profile, weightEntries, waistEntries])

  if (profileLoading || weightLoading || !profile) {
    return <p className="text-text-dim p-6">Loading...</p>
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <header>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-text-dim text-sm">Goal: {profile.target_weight_kg} kg by {profile.target_date}</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Current weight" value={`${summary.currentWeight?.toFixed(1) ?? '—'} kg`} sub="7-day average" />
        <StatCard label="Gained so far" value={`${summary.gained >= 0 ? '+' : ''}${summary.gained} kg`} accent />
        <StatCard label="Remaining" value={`${summary.remaining} kg`} />
        <StatCard
          label="Avg weekly change"
          value={summary.avgWeeklyChangeKg !== null ? `${summary.avgWeeklyChangeKg >= 0 ? '+' : ''}${summary.avgWeeklyChangeKg} kg` : '—'}
        />
      </div>

      {summary.projectedWeightAtTarget !== null && (
        <div className="bg-surface border border-border rounded-xl p-4 text-sm">
          <p className="text-text-dim">Projected weight on {profile.target_date}</p>
          <p className="text-lg font-semibold mt-1">{summary.projectedWeightAtTarget} kg</p>
        </div>
      )}

      {/* Sweet spot weekly recommendation */}
      {sweetSpot && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-text-dim text-xs uppercase tracking-wide">Weekly review</p>
            <span className={`text-xs font-medium ${PHASE_LABEL[sweetSpot.phase].color}`}>
              {PHASE_LABEL[sweetSpot.phase].text}
            </span>
          </div>
          <p className="text-sm text-text mb-2">{sweetSpot.reason}</p>
          {sweetSpot.phase !== 'insufficient_data' && sweetSpot.newCalorieTarget !== profile.calorie_target && (
            <p className="text-sm text-accent">
              Suggested target: {profile.calorie_target} → {sweetSpot.newCalorieTarget} kcal/day
            </p>
          )}
        </div>
      )}

      <div>
        <h2 className="text-sm text-text-dim uppercase tracking-wide mb-2">Weight trend</h2>
        <div className="bg-surface border border-border rounded-xl p-4">
          <WeightChart entries={weightEntries} targetWeight={profile.target_weight_kg} />
        </div>
      </div>

      <div>
        <h2 className="text-sm text-text-dim uppercase tracking-wide mb-2">Today's nutrition</h2>
        <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <ProgressBar label="Calories" current={foodTotals.calories} target={profile.calorie_target} unit="kcal" />
          <ProgressBar label="Protein" current={foodTotals.protein_g} target={profile.protein_target_g} unit="g" />
          <ProgressBar label="Fat" current={foodTotals.fat_g} target={profile.fat_target_g} unit="g" />
          <ProgressBar label="Fibre" current={foodTotals.fibre_g} target={profile.fibre_target_g} unit="g" />
        </div>
      </div>
    </div>
  )
}
