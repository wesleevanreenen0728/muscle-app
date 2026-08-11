import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const DEFAULTS = {
  age: 43,
  sex: 'male',
  height_cm: 180,
  starting_weight_kg: 86,
  target_weight_kg: 92,
  target_date: '2026-12-31',
  activity_level: 'low',
  weekly_gain_target_kg: 0.25,
  calorie_target: 2950,
  protein_target_g: 160,
  fat_target_g: 80,
  fibre_target_g: 30,
  water_target_ml: 3000,
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

    if (error) {
      console.error('Failed to load profile:', error)
      setLoading(false)
      return
    }

    if (!data) {
      // First login — create a profile row with sensible defaults
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert({ id: user.id, ...DEFAULTS })
        .select()
        .single()
      if (createError) console.error('Failed to create profile:', createError)
      setProfile(created ?? { id: user.id, ...DEFAULTS })
    } else {
      setProfile(data)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  return { profile, loading, updateProfile, refresh: load }
}
