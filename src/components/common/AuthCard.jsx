import styles from './AuthCard.module.css'

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1>{title}</h1>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
        {children}
        {footer && <p className={styles.footer}>{footer}</p>}
      </div>
    </div>
  )
}
