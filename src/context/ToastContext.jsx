import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import ConfirmDialog from '../components/common/ConfirmDialog'
import styles from '../components/common/Toast.module.css'

// App-wide notification centre. Replaces native window.alert / window.confirm with
// styled, dismissible toasts and a promise-based confirmation dialog.
const ToastContext = createContext(null)

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null)
  const resolver = useRef(null)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback((message, { type = 'success', duration = 4800 } = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts((list) => [...list, { id, message, type }])
    if (duration) setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  const confirm = useCallback((options) => new Promise((resolve) => {
    resolver.current = resolve
    setDialog(typeof options === 'string' ? { message: options } : options)
  }), [])

  const settle = useCallback((result) => {
    setDialog(null)
    if (resolver.current) {
      resolver.current(result)
      resolver.current = null
    }
  }, [])

  const value = useMemo(() => ({
    toast,
    success: (message, options) => toast(message, { ...options, type: 'success' }),
    error: (message, options) => toast(message, { ...options, type: 'error' }),
    info: (message, options) => toast(message, { ...options, type: 'info' }),
    confirm,
  }), [toast, confirm])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((item) => {
          const Icon = ICONS[item.type] ?? Info
          return (
            <div key={item.id} className={`${styles.toast} ${styles[item.type]}`} role="status">
              <Icon size={20} className={styles.icon} aria-hidden="true" />
              <p className={styles.message}>{item.message}</p>
              <button type="button" className={styles.close} onClick={() => dismiss(item.id)} aria-label="Dismiss notification">
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
      <ConfirmDialog
        open={Boolean(dialog)}
        title={dialog?.title}
        message={dialog?.message}
        confirmLabel={dialog?.confirmLabel}
        cancelLabel={dialog?.cancelLabel}
        tone={dialog?.tone}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}

export function useConfirm() {
  return useToast().confirm
}
