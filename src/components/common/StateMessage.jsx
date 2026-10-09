import styles from './StateMessage.module.css'

// Loading / error / empty placeholder used by every data-driven section.
export default function StateMessage({ loading, error, empty, emptyText = 'Nothing to show yet.' }) {
  if (loading) return <p className={styles.state} role="status">Loading…</p>
  if (error) return <p className={`${styles.state} ${styles.error}`} role="alert">{error}</p>
  if (empty) return <p className={styles.state}>{emptyText}</p>
  return null
}
