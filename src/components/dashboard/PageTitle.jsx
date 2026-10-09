import styles from './PageTitle.module.css'

export default function PageTitle({ title, children }) {
  return (
    <div className={styles.row}>
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  )
}
