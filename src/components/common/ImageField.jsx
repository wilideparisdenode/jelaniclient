import { useId, useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { api, errorMessage } from '../../lib/api'
import styles from './ImageField.module.css'

// URL input plus "upload from device". A chosen file is POSTed to /admin/uploads and its
// public URL is written into the named input, so the surrounding <form>'s FormData still
// carries the value on submit. Shows a live preview and flags links that are not images.
export default function ImageField({ label, name, defaultValue = '', folder = 'media', hint, className = '' }) {
  const id = useId()
  const fileRef = useRef(null)
  const [url, setUrl] = useState(defaultValue || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [broken, setBroken] = useState(false)

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true); setError(''); setBroken(false)
    try {
      const body = new FormData()
      body.append('file', file)
      const { data } = await api.post(`/admin/uploads?folder=${encodeURIComponent(folder)}`, body)
      setUrl(data.url)
    } catch (requestError) {
      setError(errorMessage(requestError, 'Upload failed.'))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.row}>
        <input
          id={id} type="url" name={name} value={url} placeholder="https://… or upload a file"
          onChange={(event) => { setUrl(event.target.value); setBroken(false) }}
        />
        <button type="button" className={styles.upload} onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 size={16} className={styles.spin} /> : <ImagePlus size={16} />} {busy ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className={styles.file} onChange={onFile} />
      </div>
      {hint && <small>{hint}</small>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {url && !busy && (
        <div className={styles.preview}>
          {broken
            ? <p className={styles.error}>Could not load an image from that link. Use a direct image URL or upload a file.</p>
            : <img src={url} alt="" onError={() => setBroken(true)} />}
          <button type="button" className={styles.clear} onClick={() => { setUrl(''); setBroken(false) }} aria-label="Remove image"><X size={14} /> Remove</button>
        </div>
      )}
    </div>
  )
}
