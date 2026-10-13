import { useResource } from '../../hooks/useResource'
import { formatDate } from '../../lib/format'
import DataTable from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import styles from './admin.module.css'

// Confirmed (paid) students only — one row per paid course registration.
export default function AdminRoster() {
  const roster = useResource('/admin/roster', 'students')
  return (
    <>
      <PageTitle title="Enrollments" />
      <p className={styles.check} style={{ marginBottom: 12 }}>
        Every student with a <strong>confirmed (paid) registration</strong>. Each row shows the student's
        contact details, the course they enrolled in, when they registered and the date their payment was
        confirmed. Pending or cancelled orders appear under <strong>Orders</strong> instead.
      </p>
      <DataTable
        loading={roster.loading} error={roster.error} rows={roster.rows} empty="No enrolled students yet."
        columns={[
          { key: 'studentName', header: 'Student' },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Phone', render: (row) => row.phone || '—' },
          { key: 'course', header: 'Course', render: (row) => row.course?.title },
          { key: 'createdAt', header: 'Registered', render: (row) => formatDate(row.createdAt) },
          { key: 'updatedAt', header: 'Paid on', render: (row) => formatDate(row.updatedAt) ?? '—' },
        ]}
      />
    </>
  )
}
