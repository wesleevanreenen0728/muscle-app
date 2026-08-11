import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

/**
 * Reusable hook for tables shaped like { user_id, entry_date, ...fields },
 * used for weight_entries and waist_entries. Upserts on (user_id, entry_date)
 * so re-logging the same day just updates it instead of erroring.
 */
export function useDailyEntries(tableName) {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: true })
    if (error) console.error(`Failed to load ${tableName}:`, error)
    setEntries(data ?? [])
    setLoading(false)
  }, [user, tableName])

  useEffect(() => {
    load()
  }, [load])

  const addEntry = async (fields) => {
    const { data, error } = await supabase
      .from(tableName)
      .upsert({ user_id: user.id, ...fields }, { onConflict: 'user_id,entry_date' })
      .select()
      .single()
    if (error) throw error
    setEntries((prev) => {
      const withoutDupe = prev.filter((e) => e.entry_date !== data.entry_date)
      return [...withoutDupe, data].sort((a, b) => a.entry_date.localeCompare(b.entry_date))
    })
    return data
  }

  const deleteEntry = async (id) => {
    const { error } = await supabase.from(tableName).delete().eq('id', id)
    if (error) throw error
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return { entries, loading, addEntry, deleteEntry, refresh: load }
}
