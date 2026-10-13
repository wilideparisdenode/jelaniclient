import { useState } from 'react'
import { ArrowRight, Lock } from 'lucide-react'
import { api, errorMessage } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import FormField from '../common/FormField'
import styles from './CheckoutForm.module.css'

// Collects student details + optional branch and redirects to Stripe Checkout (created by Express).
export default function CheckoutForm({ course }) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    try {
      const { data } = await api.post('/stripe/checkout-session', {
        courseId: course.id,
        branchId: form.get('branchId') || undefined,
        name: (form.get('name') || '').trim(),
        phone: (form.get('phone') || '').trim() || undefined,
      })
      window.location.assign(data.url)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Checkout is temporarily unavailable. Please try again.'))
      setBusy(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <FormField label="Full name" name="name" autoComplete="name" required minLength={2} maxLength={100} defaultValue={user?.fullName || ''} />
      <FormField label="Email" name="email" type="email" value={user?.email || ''} readOnly hint="Your receipt is sent to your account email." />
      <FormField label="Phone (optional)" name="phone" type="tel" autoComplete="tel" minLength={7} maxLength={30} defaultValue={user?.phone || ''} />
      {course.branches?.length > 0 && (
        <label className={styles.select}>
          <span>Preferred branch</span>
          <select name="branchId" defaultValue="">
            <option value="">No preference</option>
            {course.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} ({branch.mode})</option>)}
          </select>
        </label>
      )}
      {error && <p className={styles.error} role="alert">{error}</p>}
      <Button type="submit" size="lg" block disabled={busy}>
        {busy ? 'Opening secure checkout…' : <><Lock size={16} /> Pay securely <ArrowRight size={16} /></>}
      </Button>
    </form>
  )
}
