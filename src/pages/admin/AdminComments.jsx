import { useResource } from '../../hooks/useResource'
import { useConfirm } from '../../context/ToastContext'
import { formatDate } from '../../lib/format'
import Button from '../../components/common/Button'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'

// Moderation queue for comments left on posts. Only approved comments show publicly.
export default function AdminComments() {
  const comments = useResource('/admin/comments')
  const confirm = useConfirm()

  const removeComment = async (row) => {
    const ok = await confirm({ title: 'Delete comment', message: 'Delete this comment? This cannot be undone.', confirmLabel: 'Delete comment' })
    if (ok) await comments.remove(`/admin/comments/${row.id}`, { success: 'Comment deleted.' })
  }
  return (
    <>
      <PageTitle title="Comments" />
      <DataTable
        loading={comments.loading} error={comments.error} rows={comments.rows} empty="No comments yet."
        columns={[
          { key: 'created_at', header: 'Date', render: (row) => formatDate(row.created_at) },
          { key: 'author', header: 'Author' },
          { key: 'post', header: 'Post', render: (row) => row.post?.title ?? '—' },
          { key: 'body', header: 'Comment' },
          { key: 'approved', header: 'Status', render: (row) => <StatusBadge value={row.approved ? 'approved' : 'pending'} /> },
        ]}
        actions={(row) => (
          <>
            <Button size="sm" variant={row.approved ? 'outline' : 'dark'} onClick={() => comments.update(`/admin/comments/${row.id}`, { approved: !row.approved })}>{row.approved ? 'Unapprove' : 'Approve'}</Button>
            <Button size="sm" variant="danger" onClick={() => removeComment(row)}>Delete</Button>
          </>
        )}
      />
    </>
  )
}
