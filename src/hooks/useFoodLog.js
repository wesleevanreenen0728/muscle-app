import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useFoodLog(entryDate) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user || !entryDate) return
    setLoading(true)
    const { data, error } = await supabase
      .from('food_log_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', entryDate)
      .order('created_at', { ascending: true })
    if (error) console.error('Failed to load food log:', error)
    setItems(data ?? [])
    setLoading(false)
  }, [user, entryDate])

  useEffect(() => {
    load()
  }, [load])

  const addItem = async (item) => {
    const { data, error } = await supabase
      .from('food_log_entries')
      .insert({ user_id: user.id, entry_date: entryDate, ...item })
      .select()
      .single()
    if (error) throw error
    setItems((prev) => [...prev, data])
    return data
  }

  const removeItem = async (id) => {
    const { error } = await supabase.from('food_log_entries').delete().eq('id', id)
    if (error) throw error
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const totals = items.reduce(
    (acc, i) => ({
      calories: acc.calories + Number(i.calories || 0),
      protein_g: acc.protein_g + Number(i.protein_g || 0),
      carbs_g: acc.carbs_g + Number(i.carbs_g || 0),
      fat_g: acc.fat_g + Number(i.fat_g || 0),
      fibre_g: acc.fibre_g + Number(i.fibre_g || 0),
      price_eur: acc.price_eur + Number(i.price_eur || 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fibre_g: 0, price_eur: 0 }
  )

  return { items, totals, loading, addItem, removeItem, refresh: load }
}
