import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFoodLog } from '../hooks/useFoodLog'
import { useProfile } from '../hooks/useProfile'
import { toISODate } from '../lib/dateHelpers'
import ProgressBar from '../components/ProgressBar'
import QuickAddFood from '../components/QuickAddFood'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'drink']

const emptyForm = {
  meal_type: 'breakfast',
  food_name: '',
  portion_desc: '',
  calories: '',
  protein_g: '',
  carbs_g: '',
  fat_g: '',
  fibre_g: '',
  price_eur: '',
}

export default function FoodDiary() {
  const [date, setDate] = useState(toISODate(new Date()))
  const { items, totals, addItem, removeItem, loading } = useFoodLog(date)
  const { profile } = useProfile()
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [addMode, setAddMode] = useState(null) // null | 'library' | 'manual'

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const closeAdd = () => {
    setAddMode(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.food_name) return
    setSaving(true)
    try {
      await addItem({
        meal_type: form.meal_type,
        food_name: form.food_name,
        portion_desc: form.portion_desc || null,
        calories: Number(form.calories) || 0,
        protein_g: Number(form.protein_g) || 0,
        carbs_g: Number(form.carbs_g) || 0,
        fat_g: Number(form.fat_g) || 0,
        fibre_g: Number(form.fibre_g) || 0,
        price_eur: form.price_eur ? Number(form.price_eur) : null,
      })
      closeAdd()
    } finally {
      setSaving(false)
    }
  }

  const handleLibraryAdd = async (item) => {
    await addItem(item)
    closeAdd()
  }

  const grouped = MEAL_TYPES.map((type) => ({
    type,
    items: items.filter((i) => i.meal_type === type),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Food diary</h1>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-surface-alt border border-border rounded-lg px-3 py-1.5 text-sm text-text"
        />
      </header>

      {profile && (
        <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <ProgressBar label="Calories" current={totals.calories} target={profile.calorie_target} unit="kcal" />
          <ProgressBar label="Protein" current={totals.protein_g} target={profile.protein_target_g} unit="g" />
          <ProgressBar label="Carbs" current={totals.carbs_g} target={9999} unit="g" />
          <ProgressBar label="Fat" current={totals.fat_g} target={profile.fat_target_g} unit="g" />
          <ProgressBar label="Fibre" current={totals.fibre_g} target={profile.fibre_target_g} unit="g" />
          {totals.price_eur > 0 && (
            <p className="text-text-dim text-xs pt-1">Est. cost today: €{totals.price_eur.toFixed(2)}</p>
          )}
        </div>
      )}

      {addMode === null && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAddMode('library')}
            className="rounded-lg border border-dashed border-accent text-accent py-3 text-sm font-medium"
          >
            + From food library
          </button>
          <button
            onClick={() => setAddMode('manual')}
            className="rounded-lg border border-dashed border-border text-text-dim py-3 text-sm"
          >
            + Enter manually
          </button>
        </div>
      )}

      {addMode !== null && (
        <div className="flex gap-2 flex-wrap">
          {MEAL_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setForm((f) => ({ ...f, meal_type: type }))}
              className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
                form.meal_type === type ? 'bg-accent text-black border-accent' : 'border-border text-text-dim'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {addMode === 'library' && (
        <QuickAddFood mealType={form.meal_type} onAdd={handleLibraryAdd} onCancel={closeAdd} />
      )}

      {addMode === 'manual' && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <input
            required
            placeholder="Food name (e.g. Oats with milk)"
            value={form.food_name}
            onChange={update('food_name')}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
          />
          <input
            placeholder="Portion (e.g. 80g, 1 bowl)"
            value={form.portion_desc}
            onChange={update('portion_desc')}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
          />
          <div className="grid grid-cols-3 gap-2">
            <NumField label="kcal" value={form.calories} onChange={update('calories')} />
            <NumField label="Protein g" value={form.protein_g} onChange={update('protein_g')} />
            <NumField label="Carbs g" value={form.carbs_g} onChange={update('carbs_g')} />
            <NumField label="Fat g" value={form.fat_g} onChange={update('fat_g')} />
            <NumField label="Fibre g" value={form.fibre_g} onChange={update('fibre_g')} />
            <NumField label="Price €" value={form.price_eur} onChange={update('price_eur')} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={closeAdd} className="flex-1 rounded-lg border border-border text-text py-2.5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-accent text-black font-medium py-2.5 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Add'}
            </button>
          </div>
        </form>
      )}

      <Link to="/library" className="block text-center text-text-dim text-xs underline">
        Manage food library
      </Link>

      {loading ? (
        <p className="text-text-dim text-sm">Loading...</p>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.type}>
              <h3 className="text-sm text-text-dim uppercase tracking-wide mb-1.5 capitalize">{group.type}</h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5 text-sm"
                  >
                    <div>
                      <p className="text-text">{item.food_name}</p>
                      <p className="text-text-dim text-xs">
                        {item.portion_desc && `${item.portion_desc} · `}
                        {item.calories} kcal · {item.protein_g}g P
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-text-dim hover:text-danger text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {grouped.length === 0 && <p className="text-text-dim text-sm">Nothing logged yet today.</p>}
        </div>
      )}
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
