import { useState } from 'react'
import { useWorkoutLog } from '../hooks/useWorkoutLog'
import { useCardioLog } from '../hooks/useCardioLog'
import { toISODate } from '../lib/dateHelpers'
import { WORKOUT_PROGRAM, PROGRAM_NOTES } from '../lib/workoutProgram'

const DAYS = ['A', 'B', 'C']
const CARDIO_TYPES = ['walk', 'run', 'other']

export default function Training() {
  const [date, setDate] = useState(toISODate(new Date()))
  const [day, setDay] = useState('A')
  const { items: workoutItems, addItem: addWorkout, removeItem: removeWorkout, loading: workoutLoading } = useWorkoutLog(date)
  const { items: cardioItems, addItem: addCardio, removeItem: removeCardio, loading: cardioLoading } = useCardioLog(date)

  const [logging, setLogging] = useState(null) // exercise object being logged
  const [logForm, setLogForm] = useState({ sets: '', reps: '', weight_kg: '' })
  const [showCardioForm, setShowCardioForm] = useState(false)
  const [cardioForm, setCardioForm] = useState({ activity_type: 'walk', distance_km: '', duration_min: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const program = WORKOUT_PROGRAM[day]
  const loggedNames = new Set(workoutItems.map((w) => w.exercise_name))

  const startLog = (exercise) => {
    setLogging(exercise)
    setLogForm({ sets: String(exercise.sets), reps: exercise.reps, weight_kg: '' })
  }

  const submitLog = async (e) => {
    e.preventDefault()
    if (!logging) return
    setSaving(true)
    try {
      await addWorkout({
        session_label: program.label,
        exercise_name: logging.name,
        sets: Number(logForm.sets) || null,
        reps: Number(logForm.reps) || null, // if a range like "10-12" was left, this becomes null — fine, notes below cover it
        weight_kg: logForm.weight_kg ? Number(logForm.weight_kg) : null,
        notes: !Number(logForm.reps) ? logForm.reps : null, // preserve rep ranges/text as a note if not a plain number
      })
      setLogging(null)
    } finally {
      setSaving(false)
    }
  }

  const submitCardio = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addCardio({
        activity_type: cardioForm.activity_type,
        distance_km: cardioForm.distance_km ? Number(cardioForm.distance_km) : null,
        duration_min: cardioForm.duration_min ? Number(cardioForm.duration_min) : null,
        notes: cardioForm.notes || null,
      })
      setCardioForm({ activity_type: 'walk', distance_km: '', duration_min: '', notes: '' })
      setShowCardioForm(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Training</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-sm text-text"
        />
      </header>

      {/* Strength session */}
      <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
        <div className="flex gap-2">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                day === d ? 'bg-accent text-black border-accent' : 'border-border text-text-dim'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-text font-medium">{program.label}</p>

        <div className="space-y-2">
          {program.exercises.map((ex) => {
            const done = loggedNames.has(ex.name)
            return (
              <div key={ex.name} className="bg-surface-alt rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${done ? 'text-accent' : 'text-text'}`}>
                      {done && '✓ '}
                      {ex.name}
                    </p>
                    <p className="text-text-dim text-xs mt-0.5">
                      {ex.sets} sets × {ex.reps}
                    </p>
                    <p className="text-text-dim text-xs mt-1">{ex.cue}</p>
                  </div>
                  <button
                    onClick={() => startLog(ex)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-accent text-accent"
                  >
                    Log
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {logging && (
        <form onSubmit={submitLog} className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <p className="text-text font-medium">{logging.name}</p>
          <div className="grid grid-cols-3 gap-2">
            <NumField label="Sets" value={logForm.sets} onChange={(e) => setLogForm((f) => ({ ...f, sets: e.target.value }))} />
            <div>
              <label className="text-text-dim text-xs">Reps</label>
              <input
                value={logForm.reps}
                onChange={(e) => setLogForm((f) => ({ ...f, reps: e.target.value }))}
                className="w-full bg-surface-alt border border-border rounded-lg px-2 py-1.5 text-text text-sm"
              />
            </div>
            <NumField
              label="Weight/dumbbell (kg)"
              value={logForm.weight_kg}
              onChange={(e) => setLogForm((f) => ({ ...f, weight_kg: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setLogging(null)} className="flex-1 rounded-lg border border-border text-text py-2.5">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-accent text-black font-medium py-2.5 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {!workoutLoading && workoutItems.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm text-text-dim uppercase tracking-wide">Logged today</h3>
          {workoutItems.map((w) => (
            <div key={w.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5 text-sm">
              <div>
                <p className="text-text">{w.exercise_name}</p>
                <p className="text-text-dim text-xs">
                  {w.sets} × {w.notes || w.reps}
                  {w.weight_kg ? ` @ ${w.weight_kg}kg` : ''}
                </p>
              </div>
              <button onClick={() => removeWorkout(w.id)} className="text-text-dim hover:text-danger text-xs">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cardio */}
      <div>
        <h2 className="text-sm text-text-dim uppercase tracking-wide mb-2">Cardio (walking, running...)</h2>

        {!showCardioForm ? (
          <button
            onClick={() => setShowCardioForm(true)}
            className="w-full rounded-lg border border-dashed border-border text-text-dim py-3 text-sm"
          >
            + Add cardio
          </button>
        ) : (
          <form onSubmit={submitCardio} className="bg-surface border border-border rounded-xl p-4 space-y-3">
            <div className="flex gap-2">
              {CARDIO_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setCardioForm((f) => ({ ...f, activity_type: type }))}
                  className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
                    cardioForm.activity_type === type ? 'bg-accent text-black border-accent' : 'border-border text-text-dim'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumField
                label="Distance (km)"
                value={cardioForm.distance_km}
                onChange={(e) => setCardioForm((f) => ({ ...f, distance_km: e.target.value }))}
              />
              <NumField
                label="Duration (min)"
                value={cardioForm.duration_min}
                onChange={(e) => setCardioForm((f) => ({ ...f, duration_min: e.target.value }))}
              />
            </div>
            <input
              placeholder="Notes (optional)"
              value={cardioForm.notes}
              onChange={(e) => setCardioForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowCardioForm(false)} className="flex-1 rounded-lg border border-border text-text py-2.5">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-accent text-black font-medium py-2.5 disabled:opacity-60">
                {saving ? 'Saving...' : 'Add'}
              </button>
            </div>
          </form>
        )}

        {!cardioLoading && cardioItems.length > 0 && (
          <div className="space-y-1 mt-2">
            {cardioItems.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5 text-sm">
                <div>
                  <p className="text-text capitalize">{c.activity_type}</p>
                  <p className="text-text-dim text-xs">
                    {c.distance_km ? `${c.distance_km}km` : ''}
                    {c.distance_km && c.duration_min ? ' · ' : ''}
                    {c.duration_min ? `${c.duration_min} min` : ''}
                    {c.notes ? ` · ${c.notes}` : ''}
                  </p>
                </div>
                <button onClick={() => removeCardio(c.id)} className="text-text-dim hover:text-danger text-xs">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 space-y-1.5">
        <h2 className="text-sm text-text-dim uppercase tracking-wide mb-1">Program notes</h2>
        {PROGRAM_NOTES.map((note, i) => (
          <p key={i} className="text-text-dim text-xs">
            • {note}
          </p>
        ))}
      </div>
    </div>
  )
}

function NumField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-text-dim text-xs">{label}</label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={onChange}
        className="w-full bg-surface-alt border border-border rounded-lg px-2 py-1.5 text-text text-sm"
      />
    </div>
  )
}
