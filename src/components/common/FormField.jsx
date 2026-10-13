import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './FormField.module.css'

// Labelled input or textarea. Pass `as="textarea"` for multi-line.
// A `type="password"` input automatically gets a show/hide eye toggle.
export default function FormField({ label, hint, as = 'input', type, ...props }) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)
  const isPassword = as === 'input' && type === 'password'
  const Control = as
  const control = <Control id={id} type={isPassword ? (revealed ? 'text' : 'password') : type} {...props} />

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {isPassword
        ? (
          <div className={styles.passwordWrap}>
            {control}
            <button
              type="button"
              className={styles.reveal}
              onClick={() => setRevealed((value) => !value)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
              aria-pressed={revealed}
            >
              {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        )
        : control}
      {hint && <small>{hint}</small>}
    </div>
  )
}
