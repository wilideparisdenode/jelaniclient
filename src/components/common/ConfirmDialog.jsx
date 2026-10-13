import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'
import styles from './ConfirmDialog.module.css'

// Accessible confirmation dialog used instead of window.confirm. Rendered by ToastProvider.
export default function ConfirmDialog({ open, title = 'Please confirm', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', tone = 'danger', onConfirm, onCancel }) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    confirmRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onCancel() }
      if (event.key === 'Enter') { event.preventDefault(); onConfirm() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onConfirm, onCancel])

  if (!open) return null

  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <div className={`${styles.iconWrap} ${tone === 'danger' ? styles.danger : ''}`}>
          <AlertTriangle size={22} />
        </div>
        <h2 id="confirm-title" className={styles.title}>{title}</h2>
        {message && <p id="confirm-message" className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button ref={confirmRef} variant={tone === 'danger' ? 'danger' : 'dark'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
