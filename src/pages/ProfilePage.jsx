import { useState } from 'react'
import { api, errorMessage } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import FormField from '../components/common/FormField'

// Signed-in users can view and update their own name and phone number.
// ProtectedRoute guarantees `user` is loaded before this renders.
export default function ProfilePage() {
  const { user, role, refreshProfile } = useAuth()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError(''); setStatus('')
    const form = new FormData(event.currentTarget)
    try {
      await api.patch('/auth/me', { fullName: form.get('fullName'), phone: form.get('phone') || undefined })
      await refreshProfile()
      setStatus('Profile updated.')
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="My profile" subtitle="Keep your contact details up to date so we can reach you about your courses." />
      <Section>
        <form onSubmit={submit} style={{ maxWidth: 560, display: 'grid', gap: 16 }}>
          <FormField label="Email" name="email" type="email" value={user?.email ?? ''} readOnly hint="Your sign-in email cannot be changed here." />
          <FormField label="Full name" name="fullName" required minLength={2} maxLength={100} defaultValue={user?.fullName ?? ''} />
          <FormField label="Phone" name="phone" type="tel" minLength={7} maxLength={30} defaultValue={user?.phone ?? ''} hint="Optional. Used for course logistics only." />
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Account type: <strong style={{ color: 'var(--brand)', textTransform: 'capitalize' }}>{role ?? 'student'}</strong></p>
          {error && <p style={{ color: 'var(--danger)' }} role="alert">{error}</p>}
          {status && <p style={{ color: 'var(--success)' }} role="status">{status}</p>}
          <div><Button type="submit" variant="dark" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button></div>
        </form>
      </Section>
    </>
  )
}
