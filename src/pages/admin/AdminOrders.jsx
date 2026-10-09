import { useResource } from '../../hooks/useResource'
import { formatDate, formatMoney } from '../../lib/format'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'

export default function AdminOrders() {
  const orders = useResource('/admin/orders', 'orders')
  return (
    <>
      <PageTitle title="Orders" />
      <DataTable
        loading={orders.loading} error={orders.error} rows={orders.rows} empty="No orders yet."
        columns={[
          { key: 'createdAt', header: 'Date', render: (row) => formatDate(row.createdAt) },
          { key: 'studentName', header: 'Student' },
          { key: 'email', header: 'Email' },
          { key: 'course', header: 'Course', render: (row) => row.course?.title },
          { key: 'subtotal', header: 'Tuition', render: (row) => formatMoney(row.subtotalCents, row.currency) },
          { key: 'fee', header: 'Fee', render: (row) => formatMoney(row.feeCents, row.currency) },
          { key: 'total', header: 'Total', render: (row) => formatMoney(row.totalCents, row.currency) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        ]}
      />
    </>
  )
}
