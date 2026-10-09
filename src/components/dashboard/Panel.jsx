import styles from './Panel.module.css'

// White card wrapper used for dashboard forms.
export default function Panel({ title, children }) {
  return (
    <section className={styles.panel}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}
