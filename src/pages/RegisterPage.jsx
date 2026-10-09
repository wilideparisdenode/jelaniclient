import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthCard from '../components/common/AuthCard'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'

// Account creation via Supabase Auth. A profile row is created by a DB trigger.
export default function RegisterPage() {
  const { signUp, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState(false)

  if (!loading && isAuthenticated) return <Navigate to={from} replace />

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get('password') !== form.get('confirm')) { setError('Passwords do not match.'); return }
    setBusy(true); setError('')
    try {
      const result = await signUp({ email: form.get('email'), password: form.get('password'), fullName: form.get('fullName'), phone: form.get('phone') || undefined })
      if (result.needsConfirmation) setConfirm(true)
      else navigate(from, { replace: true })
    } catch (signUpError) {
      setError(signUpError.message || 'Unable to create your account.')
    } finally {
      setBusy(false)
    }
  }

  if (confirm) {
    return (
      <AuthCard title="Check your email" subtitle="We sent a confirmation link. Open it, then sign in to finish registering for your course.">
        <MailCheck size={40} color="var(--success)" />
        <Button to="/login" state={location.state} variant="dark" block>Go to sign in</Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create your account" subtitle="One account for registration, payments and your classroom." footer={<>Already registered? <Link to="/login" state={location.state}>Sign in</Link></>}>
      <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
        <FormField label="Full name" name="fullName" autoComplete="name" required minLength={2} maxLength={100} />
        <FormField label="Email" name="email" type="email" autoComplete="email" required />
        <FormField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" maxLength={30} />
        <FormField label="Password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." />
        <FormField label="Confirm password" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
        {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</p>}
        <Button type="submit" block disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</Button>
      </form>
    </AuthCard>
  )
}
