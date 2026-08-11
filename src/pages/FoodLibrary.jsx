import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFoodLibrary } from '../hooks/useFoodLibrary'

const emptyForm = {
  name: '',
  calories_per_100g: '',
  protein_per_100g: '',
  carbs_per_100g: '',
  fat_per_100g: '',
  fibre_per_100g: '',
  unit_label: '',
  unit_weight_g: '',
}

export default function FoodLibrary() {
  const { foods, loading, addFood, updateFood, deleteFood } = useFoodLibrary()
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null) // 'new' | food.id | null
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const filtered = foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  const startEdit = (food) => {
    setEditingId(food.id)
    setForm({
      name: food.name,
      calories_per_100g: food.calories_per_100g,
      protein_per_100g: food.protein_per_100g,
      carbs_per_100g: food.carbs_per_100g,
      fat_per_100g: food.fat_per_100g,
      fibre_per_100g: food.fibre_per_100g,
      unit_label: food.unit_label ?? '',
      unit_weight_g: food.unit_weight_g ?? '',
    })
  }

  const startNew = () => {
    setEditingId('new')
    setForm(emptyForm)
  }

  const cancel = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      calories_per_100g: Number(form.calories_per_100g) || 0,
      protein_per_100g: Number(form.protein_per_100g) || 0,
      carbs_per_100g: Number(form.carbs_per_100g) || 0,
      fat_per_100g: Number(form.fat_per_100g) || 0,
      fibre_per_100g: Number(form.fibre_per_100g) || 0,
      unit_label: form.unit_label || null,
      unit_weight_g: form.unit_weight_g ? Number(form.unit_weight_g) : null,
    }
    try {
      if (editingId === 'new') {
        await addFood(payload)
      } else {
        await updateFood(editingId, payload)
      }
      cancel()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 space-y-4 pb-24 max-w-2xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Food library</h1>
          <p className="text-text-dim text-sm">Values are per 100g. Edit anything once you check a real package.</p>
        </div>
        <Link to="/food" className="text-accent text-sm">
          Done
        </Link>
      </header>

      {editingId === null && (
        <>
          <div className="flex gap-2">
            <input
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
            />
            <button onClick={startNew} className="rounded-lg bg-accent text-black font-medium px-4 text-sm">
              + New
            </button>
          </div>

          {loading ? (
            <p className="text-text-dim text-sm">Loading...</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between bg-surface border border-border rounded-lg px-4 py-2.5 text-sm"
                >
                  <div>
                    <p className="text-text">{food.name}</p>
                    <p className="text-text-dim text-xs">
                      {food.calories_per_100g} kcal / 100g
                      {food.unit_weight_g && ` · 1 ${food.unit_label} ≈ ${food.unit_weight_g}g`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => startEdit(food)} className="text-accent text-xs">
                      Edit
                    </button>
                    <button onClick={() => deleteFood(food.id)} className="text-text-dim hover:text-danger text-xs">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-text-dim text-sm">No matches.</p>}
            </div>
          )}
        </>
      )}

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-4 space-y-3">
          <input
            required
            placeholder="Food name"
            value={form.name}
            onChange={update('name')}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
          />
          <p className="text-text-dim text-xs">Nutrition per 100g:</p>
          <div className="grid grid-cols-3 gap-2">
            <NumField label="kcal" value={form.calories_per_100g} onChange={update('calories_per_100g')} />
            <NumField label="Protein g" value={form.protein_per_100g} onChange={update('protein_per_100g')} />
            <NumField label="Carbs g" value={form.carbs_per_100g} onChange={update('carbs_per_100g')} />
            <NumField label="Fat g" value={form.fat_per_100g} onChange={update('fat_per_100g')} />
            <NumField label="Fibre g" value={form.fibre_per_100g} onChange={update('fibre_per_100g')} />
          </div>
          <p className="text-text-dim text-xs">
            Optional — lets you log "1 {form.unit_label || 'item'}" instead of grams (e.g. egg, chicken breast):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-text-dim text-xs">Unit name</label>
              <input
                placeholder="e.g. egg"
                value={form.unit_label}
                onChange={update('unit_label')}
                className="w-full bg-surface-alt border border-border rounded-lg px-2 py-1.5 text-text text-sm"
              />
            </div>
            <NumField label="Weight per unit (g)" value={form.unit_weight_g} onChange={update('unit_weight_g')} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={cancel} className="flex-1 rounded-lg border border-border text-text py-2.5">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-accent text-black font-medium py-2.5 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId === 'new' ? 'Add food' : 'Save changes'}
            </button>
          </div>
        </form>
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
