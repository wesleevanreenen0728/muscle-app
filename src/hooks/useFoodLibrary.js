import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { SEED_FOODS } from '../lib/commonFoods'

export function useFoodLibrary() {
  const { user } = useAuth()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) {
      console.error('Failed to load food library:', error)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      // First time using the library — seed it with common starter foods.
      const seedRows = SEED_FOODS.map((f) => ({ user_id: user.id, is_seed: true, ...f }))
      const { data: inserted, error: seedError } = await supabase
        .from('food_items')
        .insert(seedRows)
        .select()
      if (seedError) {
        console.error('Failed to seed food library:', seedError)
        setFoods([])
      } else {
        setFoods((inserted ?? []).sort((a, b) => a.name.localeCompare(b.name)))
      }
    } else {
      setFoods(data)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const addFood = async (fields) => {
    const { data, error } = await supabase
      .from('food_items')
      .insert({ user_id: user.id, is_seed: false, ...fields })
      .select()
      .single()
    if (error) throw error
    setFoods((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }

  const updateFood = async (id, fields) => {
    const { data, error } = await supabase
      .from('food_items')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setFoods((prev) => prev.map((f) => (f.id === id ? data : f)).sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }

  const deleteFood = async (id) => {
    const { error } = await supabase.from('food_items').delete().eq('id', id)
    if (error) throw error
    setFoods((prev) => prev.filter((f) => f.id !== id))
  }

  return { foods, loading, addFood, updateFood, deleteFood, refresh: load }
}
