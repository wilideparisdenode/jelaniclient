import { useRef, useState } from 'react'
import { User } from 'lucide-react'
import { api, errorMessage } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import FormField from '../components/common/FormField'
import styles from './ProfilePage.module.css'

// Signed-in users can view/update their details and upload a profile picture.
// ProtectedRoute guarantees `user` is loaded before this renders.
export default function ProfilePage() {
  const { user, role, avatarUrl, refreshProfile } = useAuth()
  const fileRef = useRef(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true); setError(''); setStatus('')
    try {
      const body = new FormData()
      body.append('file', file)
      await api.post('/auth/me/avatar', body)
      await refreshProfile()
      setStatus('Profile picture updated.')
    } catch (requestError) {
      setError(errorMessage(requestError, 'Could not upload that image.'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeAvatar = async () => {
    setUploading(true); setError(''); setStatus('')
    try {
      await api.delete('/auth/me/avatar')
      await refreshProfile()
      setStatus('Profile picture removed.')
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <PageHeader title="My profile" subtitle="Keep your details up to date and add a photo so people recognise you." />
      <Section>
        <div className={styles.avatarRow}>
          <span className={styles.avatarPreview}>
            {avatarUrl ? <img src={avatarUrl} alt="" /> : <User size={34} />}
          </span>
          <div className={styles.avatarActions}>
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Upload photo'}
            </Button>
            {avatarUrl && <Button size="sm" variant="ghost" onClick={removeAvatar} disabled={uploading}>Remove</Button>}
            <input ref={fileRef} type="file" accept="image/*" className={styles.file} onChange={onFile} />
            <small>PNG, JPEG, WebP, GIF, AVIF or SVG · maximum 5MB.</small>
          </div>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <FormField label="Email" name="email" type="email" value={user?.email ?? ''} readOnly hint="Your sign-in email cannot be changed here." />
          <FormField label="Full name" name="fullName" required minLength={2} maxLength={100} defaultValue={user?.fullName ?? ''} />
          <FormField label="Phone" name="phone" type="tel" minLength={7} maxLength={30} defaultValue={user?.phone ?? ''} hint="Optional. Used for course logistics only." />
          <p className={styles.meta}>Account type: <strong>{role ?? 'student'}</strong></p>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {status && <p className={styles.status} role="status">{status}</p>}
          <div><Button type="submit" variant="dark" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button></div>
        </form>
      </Section>
    </>
  )
}
