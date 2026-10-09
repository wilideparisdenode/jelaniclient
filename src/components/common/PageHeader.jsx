import styles from './PageHeader.module.css'

export default function PageHeader({ title, subtitle }) {
  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  )
}
