import StateMessage from '../common/StateMessage'
import styles from './DataTable.module.css'

// columns: [{ key, header, render?(row) }]. `actions(row)` renders a trailing cell.
export default function DataTable({ columns, rows, loading, error, empty = 'Nothing here yet.', actions, rowKey = 'id' }) {
  if (loading || error || !rows?.length) return <StateMessage loading={loading} error={error} empty={!loading && !error} emptyText={empty} />
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.header}</th>)}{actions && <th aria-label="Actions" />}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((column) => <td key={column.key} data-label={column.header}>{column.render ? column.render(row) : row[column.key]}</td>)}
              {actions && <td className={styles.actions} data-label="Actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StatusBadge({ value }) {
  return <span className={`${styles.badge} ${styles[value] || ''}`}>{value}</span>
}
