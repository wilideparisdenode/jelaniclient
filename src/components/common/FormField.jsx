import { useId } from 'react'
import styles from './FormField.module.css'

// Labelled input or textarea. Pass `as="textarea"` for multi-line.
export default function FormField({ label, hint, as = 'input', ...props }) {
  const id = useId()
  const Control = as
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <Control id={id} {...props} />
      {hint && <small>{hint}</small>}
    </div>
  )
}
