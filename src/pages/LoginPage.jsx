import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabaseConfigured } from '../lib/supabase'
import AuthCard from '../components/common/AuthCard'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'

export default function LoginPage() {
  const { signIn, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && isAuthenticated) return <Navigate to={from} replace />

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    try {
      await signIn(form.get('email'), form.get('password'))
      navigate(from, { replace: true })
    } catch (signInError) {
      setError(signInError.message || 'Unable to sign in.')
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue your registration or learning." footer={<>New here? <Link to="/register" state={location.state}>Create an account</Link></>}>
      <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        <FormField label="Email" name="email" type="email" autoComplete="username" required />
        <FormField label="Password" name="password" type="password" autoComplete="current-password" required />
        {!supabaseConfigured && <p role="alert" style={{ color: 'var(--danger)', fontSize: 14 }}>Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>}
        {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
      </form>
    </AuthCard>
  )
}
