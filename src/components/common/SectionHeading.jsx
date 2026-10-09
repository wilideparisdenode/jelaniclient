import styles from './SectionHeading.module.css'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <header className={`${styles.heading} ${styles[align]}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  )
}
