import axios from 'axios'
import { supabase } from './supabase'

// Always route through the Express API's /api prefix, even if VITE_API_URL omits it.
function normalizeApiBaseUrl(value) {
  const base = (value || 'http://localhost:4000/api').trim().replace(/\/+$/, '')
  return base.endsWith('/api') ? base : `${base}/api`
}

export const api = axios.create({ baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL) })

// Attach the current Supabase access token to every API request.
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data?.error
  // Surface which field(s) failed API validation instead of a generic message.
  if (data?.details?.length) {
    const fields = [...new Set(data.details.map((detail) => detail.field))]
    return `${data.message} (check: ${fields.join(', ')})`
  }
  return data?.message || error?.message || fallback
}
