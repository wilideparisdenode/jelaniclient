import { useResource } from '../../hooks/useResource'
import { formatDate } from '../../lib/format'
import DataTable from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'

// Confirmed (paid) students only.
export default function AdminRoster() {
  const roster = useResource('/admin/roster', 'students')
  return (
    <>
      <PageTitle title="Student Roster" />
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
