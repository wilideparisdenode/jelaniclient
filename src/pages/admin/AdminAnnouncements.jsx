import { useFetch } from '../../hooks/useFetch'
import { useResource } from '../../hooks/useResource'
import { useConfirm } from '../../context/ToastContext'
import { formatDate } from '../../lib/format'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import DataTable from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

// Broadcast messages. course_id null targets every student; otherwise only that course's cohort.
export default function AdminAnnouncements() {
  const announcements = useResource('/admin/announcements')
  const courses = useFetch('/courses/admin', { select: (b) => b.courses, initial: [] })
  const confirm = useConfirm()

  const removeAnnouncement = async (row) => {
    const ok = await confirm({ title: 'Delete announcement', message: `Delete "${row.title}"? This cannot be undone.`, confirmLabel: 'Delete announcement' })
    if (ok) await announcements.remove(`/admin/announcements/${row.id}`, { success: `"${row.title}" was deleted.` })
  }

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const ok = await announcements.create('/admin/announcements', {
      title: data.title,
      body: data.body,
      course_id: data.course_id || undefined,
      expires_at: data.expires_at ? new Date(data.expires_at).toISOString() : undefined,
    })
    if (ok) form.reset()
  }

  return (
    <>
      <PageTitle title="Announcements" />
      <DataTable
        loading={announcements.loading} error={announcements.error} rows={announcements.rows} empty="No announcements yet."
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'course', header: 'Audience', render: (row) => row.course?.title ?? 'All students' },
          { key: 'created_at', header: 'Posted', render: (row) => formatDate(row.created_at) },
          { key: 'expires_at', header: 'Expires', render: (row) => formatDate(row.expires_at) ?? 'No expiry' },
        ]}
        actions={(row) => (
          <Button size="sm" variant="danger" onClick={() => removeAnnouncement(row)}>Delete</Button>
        )}
      />

      <Panel title="New announcement">
        <form className={styles.form} onSubmit={submit}>
          <FormField label="Title" name="title" required minLength={3} maxLength={140} />
          <label className={styles.select}><span>Audience</span>
            <select name="course_id" defaultValue="">
              <option value="">All students</option>
              {courses.data.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
          </label>
          <FormField label="Message" name="body" as="textarea" required minLength={3} maxLength={4000} />
          <FormField label="Active until (optional)" name="expires_at" type="datetime-local" hint="Leave blank to keep the announcement active indefinitely." />
          <div className={styles.actions}><Button type="submit" variant="dark">Publish announcement</Button></div>
        </form>
      </Panel>
    </>
  )
}
