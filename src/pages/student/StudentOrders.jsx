import { useResource } from '../../hooks/useResource'
import { formatDate, formatMoney } from '../../lib/format'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'

// Every order this student has placed, newest first.
export default function StudentOrders() {
  const orders = useResource('/student/orders', 'orders')
  return (
    <>
      <PageTitle title="Orders" />
      <DataTable
        loading={orders.loading} error={orders.error} rows={orders.rows} empty="No orders yet."
        columns={[
          { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
          { key: 'course', header: 'Course', render: (row) => row.course?.title },
          { key: 'total', header: 'Total', render: (row) => formatMoney(row.totalCents, row.currency) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
    </>
  )
}
