import { createClient } from '@supabase/supabase-js'

// Provide fallback values if environment variables are missing (useful for Blink preview)
const FALLBACK_SUPABASE_URL = 'https://ajvjbecijxbtpahgvguo.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdmpiZWNpanhidHBhaGd2Z3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDcyNzgsImV4cCI6MjA2NzY4MzI3OH0.jYQVJR-PZ8ne8RSKPfXn4ZRgzm69ao9ZkJ61wH8SgLw'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Supabase environment variables are missing. Using fallback values. ' +
    'For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in project secrets.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)