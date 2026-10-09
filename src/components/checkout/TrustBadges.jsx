import { CreditCard, Lock, RefreshCcw, ShieldCheck } from 'lucide-react'
import styles from './TrustBadges.module.css'

const badges = [
  { icon: Lock, label: '256-bit SSL encryption' },
  { icon: ShieldCheck, label: 'Secured by Stripe' },
  { icon: CreditCard, label: 'We never store card details' },
  { icon: RefreshCcw, label: 'Refunds via support' },
]

export default function TrustBadges() {
  return (
    <ul className={styles.list} aria-label="Payment security">
      {badges.map(({ icon: Icon, label }) => <li key={label}><Icon size={16} /> {label}</li>)}
    </ul>
  )
}
