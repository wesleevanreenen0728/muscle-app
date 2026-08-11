import { useState } from 'react'
import { useDailyEntries } from '../hooks/useDailyEntries'
import { useProfile } from '../hooks/useProfile'
import { toISODate } from '../lib/dateHelpers'
import WeightChart from '../components/WeightChart'

export default function WeightTracker() {
  const { entries, addEntry, deleteEntry, loading } = useDailyEntries('weight_entries')
  const { profile } = useProfile()
  const [date, setDate] = useState(toISODate(new Date()))
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!weight) return
    setSaving(true)
    try {
      await addEntry({ entry_date: date, weight_kg: Number(weight), notes: notes || null })
      setWeight('')
      setNotes('')
    } finally {
      setSaving(false)
    }
  }

  const sortedDesc = [...entries].sort((a, b) => b.entry_date.localeCompare(a.entry_date))

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <header>
        <h1 className="text-xl font-semibold">Weight</h1>
        <p className="text-text-dim text-sm">
          Weigh yourself in the morning, after the bathroom, before eating or drinking.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-4 space-y-3">
        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 bg-surface-alt border border-border rounded-lg px-3 py-2 text-text"
          />
          <input
            type="number"
            step="0.1"
            required
            placeholder="kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-24 bg-surface-alt border border-border rounded-lg px-3 py-2 text-text"
          />
        </div>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
        />
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-accent text-black font-medium py-2.5 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Log weight'}
        </button>
      </form>

      <div className="bg-surface border border-border rounded-xl p-4">
        <WeightChart entries={entries} targetWeight={profile?.target_weight_kg} />
      </div>

      <div>
        <h2 className="text-sm text-text-dim uppercase tracking-wide mb-2">History</h2>
        {loading ? (
          <p className="text-text-dim text-sm">Loading...</p>
        ) : (
          <div className="space-y-1">
            {sortedDesc.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5 text-sm"
              >
                <div>
                  <span className="text-text">{entry.entry_date}</span>
                  {entry.notes && <span className="text-text-dim ml-2">· {entry.notes}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text font-medium">{entry.weight_kg} kg</span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-text-dim hover:text-danger text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
