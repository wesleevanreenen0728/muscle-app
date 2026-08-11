import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../context/AuthContext'
import { calculateStartingCalorieTarget, calculateMacroTargets } from '../lib/calorieCalc'

export default function Settings() {
  const { profile, updateProfile, loading } = useProfile()
  const { user, signOut } = useAuth()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  if (loading || !form) return <p className="text-text-dim p-6">Loading...</p>

  const update = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setSaved(false)
  }

  const applySuggestedCalories = () => {
    const suggested = calculateStartingCalorieTarget({
      sex: form.sex,
      weightKg: form.starting_weight_kg,
      heightCm: form.height_cm,
      age: form.age,
      activityLevel: form.activity_level,
    })
    const macros = calculateMacroTargets({ calorieTarget: suggested, weightKg: form.starting_weight_kg })
    setForm((f) => ({
      ...f,
      calorie_target: suggested,
      protein_target_g: macros.proteinG,
      fat_target_g: macros.fatG,
      fibre_target_g: macros.fibreG,
      water_target_ml: macros.waterMl,
    }))
    setSaved(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <header>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-text-dim text-sm">Signed in as {user?.email}</p>
      </header>

      <form onSubmit={handleSave} className="space-y-5">
        <Section title="Profile">
          <Row>
            <Field label="Age" type="number" value={form.age} onChange={update('age')} />
            <Field label="Sex" type="select" value={form.sex} onChange={update('sex')} options={['male', 'female']} />
          </Row>
          <Row>
            <Field label="Height (cm)" type="number" value={form.height_cm} onChange={update('height_cm')} />
            <Field
              label="Activity level"
              type="select"
              value={form.activity_level}
              onChange={update('activity_level')}
              options={['low', 'moderate', 'active']}
            />
          </Row>
        </Section>

        <Section title="Weight goal">
          <Row>
            <Field label="Starting weight (kg)" type="number" step="0.1" value={form.starting_weight_kg} onChange={update('starting_weight_kg')} />
            <Field label="Target weight (kg)" type="number" step="0.1" value={form.target_weight_kg} onChange={update('target_weight_kg')} />
          </Row>
          <Row>
            <Field label="Target date" type="date" value={form.target_date} onChange={update('target_date')} />
            <Field
              label="Weekly gain target (kg)"
              type="number"
              step="0.05"
              value={form.weekly_gain_target_kg}
              onChange={update('weekly_gain_target_kg')}
            />
          </Row>
          <p className="text-text-dim text-xs">
            0.2–0.3 kg/week is a conservative, muscle-favouring rate. Higher rates risk more fat gain.
          </p>
        </Section>

        <Section title="Nutrition targets">
          <button
            type="button"
            onClick={applySuggestedCalories}
            className="text-sm text-accent underline mb-2"
          >
            Recalculate suggested targets from profile
          </button>
          <Row>
            <Field label="Calorie target" type="number" value={form.calorie_target} onChange={update('calorie_target')} />
            <Field label="Protein target (g)" type="number" value={form.protein_target_g} onChange={update('protein_target_g')} />
          </Row>
          <Row>
            <Field label="Fat target (g)" type="number" value={form.fat_target_g} onChange={update('fat_target_g')} />
            <Field label="Fibre target (g)" type="number" value={form.fibre_target_g} onChange={update('fibre_target_g')} />
          </Row>
          <Field label="Water target (ml)" type="number" value={form.water_target_ml} onChange={update('water_target_ml')} />
          <p className="text-text-dim text-xs">
            These are adaptive — the weekly review on your Dashboard will suggest calorie changes based on
            your actual results. You can also edit any of these manually any time.
          </p>
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-accent text-black font-medium py-3 disabled:opacity-60"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
        </button>
      </form>

      <button onClick={signOut} className="w-full text-text-dim text-sm py-2">
        Sign out
      </button>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <h2 className="text-sm text-text-dim uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  )
}

function Row({ children }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

function Field({ label, type = 'text', value, onChange, options, step }) {
  return (
    <div>
      <label className="text-text-dim text-xs block mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text capitalize"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text"
        />
      )}
    </div>
  )
}
