import { useMemo, useState } from 'react'
import { useFoodLibrary } from '../hooks/useFoodLibrary'
import { scaleFoodToGrams, unitsToGrams } from '../lib/foodLibraryCalc'

export default function QuickAddFood({ mealType, onAdd, onCancel }) {
  const { foods, loading } = useFoodLibrary()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('units') // 'units' | 'grams' — auto-set when a food is picked

  const filtered = useMemo(() => {
    if (!search.trim()) return foods
    const q = search.toLowerCase()
    return foods.filter((f) => f.name.toLowerCase().includes(q))
  }, [foods, search])

  const pick = (food) => {
    setSelected(food)
    setMode(food.unit_weight_g ? 'units' : 'grams')
    setAmount(food.unit_weight_g ? '1' : '100')
  }

  const grams = selected && amount ? (mode === 'units' ? unitsToGrams(selected, Number(amount)) : Number(amount)) : 0
  const preview = selected && grams > 0 ? scaleFoodToGrams(selected, grams) : null

  const handleAdd = () => {
    if (!selected || !preview) return
    onAdd({
      meal_type: mealType,
      food_name: selected.name,
      portion_desc:
        mode === 'units' ? `${amount} ${selected.unit_label}${Number(amount) !== 1 ? 's' : ''} (${Math.round(grams)}g)` : `${Math.round(grams)}g`,
      calories: preview.calories,
      protein_g: preview.protein_g,
      carbs_g: preview.carbs_g,
      fat_g: preview.fat_g,
      fibre_g: preview.fibre_g,
      price_eur: null,
    })
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      {!selected ? (
        <>
          <input
            autoFocus
            placeholder="Search your food library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-alt border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-dim"
          />
          {loading ? (
            <p className="text-text-dim text-sm">Loading library...</p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filtered.map((food) => (
                <button
                  key={food.id}
                  onClick={() => pick(food)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-surface-alt hover:bg-border text-sm text-text flex justify-between items-center"
                >
                  <span>{food.name}</span>
                  <span className="text-text-dim text-xs">
                    {food.unit_weight_g ? `1 ${food.unit_label} ≈ ${food.unit_weight_g}g` : 'per 100g'}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-text-dim text-sm">No matches. Try Manage Library to add it.</p>}
            </div>
          )}
          <button onClick={onCancel} className="w-full rounded-lg border border-border text-text py-2.5">
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-text font-medium">{selected.name}</p>
            <button onClick={() => setSelected(null)} className="text-text-dim text-xs underline">
              Change
            </button>
          </div>

          <div className="flex gap-2 items-center">
            {selected.unit_weight_g && (
              <div className="flex rounded-lg border border-border overflow-hidden text-xs">
                <button
                  onClick={() => {
                    setMode('units')
                    setAmount('1')
                  }}
                  className={`px-3 py-1.5 ${mode === 'units' ? 'bg-accent text-black' : 'text-text-dim'}`}
                >
                  {selected.unit_label}s
                </button>
                <button
                  onClick={() => {
                    setMode('grams')
                    setAmount('100')
                  }}
                  className={`px-3 py-1.5 ${mode === 'grams' ? 'bg-accent text-black' : 'text-text-dim'}`}
                >
                  grams
                </button>
              </div>
            )}
            <input
              type="number"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-surface-alt border border-border rounded-lg px-3 py-2 text-text"
              placeholder={mode === 'units' ? `e.g. 2` : 'grams'}
            />
            <span className="text-text-dim text-sm">{mode === 'units' ? selected.unit_label + (Number(amount) !== 1 ? 's' : '') : 'g'}</span>
          </div>

          {preview && (
            <div className="bg-surface-alt rounded-lg p-3 text-sm text-text-dim space-y-1">
              <p className="text-text">≈ {Math.round(grams)}g total</p>
              <p>
                {preview.calories} kcal · {preview.protein_g}g protein · {preview.carbs_g}g carbs · {preview.fat_g}g fat ·{' '}
                {preview.fibre_g}g fibre
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={onCancel} className="flex-1 rounded-lg border border-border text-text py-2.5">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!preview}
              className="flex-1 rounded-lg bg-accent text-black font-medium py-2.5 disabled:opacity-60"
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  )
}
