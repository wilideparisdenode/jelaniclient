import styles from './Section.module.css'

// Consistent vertical rhythm + centred container for every page section.
export default function Section({ id, tone = 'plain', children, className = '' }) {
  return (
    <section id={id} className={`${styles.section} ${styles[tone]} ${className}`}>
      <div className={styles.container}>{children}</div>
    </section>
  )
}
