import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null) // { id, email, role, fullName }
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (activeSession) => {
    if (!activeSession) { setProfile(null); return }
    try {
      const { data } = await api.get('/auth/me')
      setProfile(data.user)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await loadProfile(data.session)
      if (active) setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      // Defer: calling Supabase from inside this callback can deadlock.
      setTimeout(() => loadProfile(nextSession), 0)
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [loadProfile])

  const value = useMemo(() => ({
    session,
    user: profile,
    role: profile?.role ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    isAdmin: profile?.role === 'admin',
    isTutor: profile?.role === 'tutor',
    isStaff: profile?.role === 'admin' || profile?.role === 'tutor',
    isAuthenticated: Boolean(session),
    loading,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signUp({ email, password, fullName, phone }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Return the confirmation link to whichever site the user signed up from:
          // localhost during local development, the deployed domain in production.
          // Supabase uses this only when the origin is in the allowed redirect list.
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName, phone },
        },
      })
      if (error) throw error
      // `session` is null when email confirmation is required in the Supabase project.
      return { needsConfirmation: !data.session }
    },
    async signOut() { await supabase.auth.signOut() },
    refreshProfile: () => loadProfile(session),
  }), [session, profile, loading, loadProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
