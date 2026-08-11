import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useCardioLog(entryDate) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user || !entryDate) return
    setLoading(true)
    const { data, error } = await supabase
      .from('cardio_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', entryDate)
      .order('created_at', { ascending: true })
    if (error) console.error('Failed to load cardio log:', error)
    setItems(data ?? [])
    setLoading(false)
  }, [user, entryDate])

  useEffect(() => {
    load()
  }, [load])

  const addItem = async (item) => {
    const { data, error } = await supabase
      .from('cardio_log')
      .insert({ user_id: user.id, entry_date: entryDate, ...item })
      .select()
      .single()
    if (error) throw error
    setItems((prev) => [...prev, data])
    return data
  }

  const removeItem = async (id) => {
    const { error } = await supabase.from('cardio_log').delete().eq('id', id)
    if (error) throw error
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return { items, loading, addItem, removeItem, refresh: load }
}
