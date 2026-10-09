import { useFetch } from '../../hooks/useFetch'
import { useResource } from '../../hooks/useResource'
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

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const ok = await announcements.create('/admin/announcements', {
      title: data.title,
      body: data.body,
      course_id: data.course_id || undefined,
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
        ]}
        actions={(row) => (
          <Button size="sm" variant="danger" onClick={() => window.confirm(`Delete "${row.title}"?`) && announcements.remove(`/admin/announcements/${row.id}`)}>Delete</Button>
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
          <div className={styles.actions}><Button type="submit" variant="dark">Publish announcement</Button></div>
        </form>
      </Panel>
    </>
  )
}
