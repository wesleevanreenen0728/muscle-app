import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // This will show clearly in the browser console instead of a silent failure
  console.error(
    'Missing Supabase environment variables. Did you create a .env file ' +
      '(see .env.example) and, for the deployed site, add the same values ' +
      'as GitHub repo secrets?'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
