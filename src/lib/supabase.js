import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey)

// The anon key is public by design; data access is protected by RLS and the Express API.
export const supabase = createClient(url || 'http://localhost:54321', anonKey || 'missing-anon-key')
