import { useFetch } from '../../hooks/useFetch'
import { formatMoney } from '../../lib/format'
import styles from './FeeBreakdown.module.css'

// Transparent price summary fetched from the server's fee calculator.
export default function FeeBreakdown({ courseId, title }) {
  const { data, loading, error } = useFetch(`/stripe/fee-breakdown?courseId=${encodeURIComponent(courseId)}`)
  if (loading) return <p className={styles.note}>Calculating total…</p>
  if (error || !data) return <p className={styles.note} role="alert">{error || 'Could not calculate total.'}</p>

  return (
    <dl className={styles.table} aria-label="Order summary">
      <div><dt>{title || 'Tuition'}</dt><dd>{formatMoney(data.subtotalCents, data.currency)}</dd></div>
      <div><dt>Payment processing fee</dt><dd>{formatMoney(data.feeCents, data.currency)}</dd></div>
      <div className={styles.total}><dt>Total due today</dt><dd>{formatMoney(data.totalCents, data.currency)}</dd></div>
    </dl>
  )
}
