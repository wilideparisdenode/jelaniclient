import { useState } from 'react'
import { useResource } from '../../hooks/useResource'
import { useConfirm } from '../../context/ToastContext'
import { formatDate } from '../../lib/format'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import ImageField from '../../components/common/ImageField'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

// Admin/tutor event manager. Events support a cover image and an optional video link.
export default function AdminEvents() {
  const events = useResource('/admin/events')
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null)

  const removeEvent = async (row) => {
    const ok = await confirm({ title: 'Delete event', message: `Delete "${row.title}"? This cannot be undone.`, confirmLabel: 'Delete event' })
    if (ok) await events.remove(`/admin/events/${row.id}`, { success: `"${row.title}" was deleted.` })
  }

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const eventDate = form.get('event_date')
    const body = {
      title: form.get('title'),
      description: form.get('description'),
      cover_image: form.get('cover_image') || undefined,
      video_url: form.get('video_url') || undefined,
      location: form.get('location') || undefined,
      event_date: eventDate ? new Date(eventDate).toISOString() : undefined,
      published: form.get('published') === 'on',
    }
    const ok = editing ? await events.update(`/admin/events/${editing.id}`, body) : await events.create('/admin/events', body)
    if (ok) { setEditing(null); event.target.reset() }
  }

  const values = editing ?? {}

  return (
    <>
      <PageTitle title="Events" />
      <DataTable
        loading={events.loading} error={events.error} rows={events.rows} empty="No events yet."
        columns={[
          { key: 'title', header: 'Event' },
          { key: 'event_date', header: 'Date', render: (row) => formatDate(row.event_date) ?? '—' },
          { key: 'location', header: 'Location', render: (row) => row.location ?? '—' },
          { key: 'published', header: 'Status', render: (row) => <StatusBadge value={row.published ? 'approved' : 'pending'} /> },
        ]}
        actions={(row) => (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditing(row)}>Edit</Button>
            <Button size="sm" variant="outline" onClick={() => events.update(`/admin/events/${row.id}`, { published: !row.published })}>{row.published ? 'Unpublish' : 'Publish'}</Button>
            <Button size="sm" variant="danger" onClick={() => removeEvent(row)}>Delete</Button>
          </>
        )}
      />

      <Panel title={editing ? `Edit: ${editing.title}` : 'Add an event'}>
        <form key={editing?.id ?? 'new'} className={styles.form} onSubmit={submit}>
          <FormField label="Title" name="title" required minLength={3} maxLength={160} defaultValue={values.title} />
          <FormField label="Date & time" name="event_date" type="datetime-local" defaultValue={values.event_date ? new Date(values.event_date).toISOString().slice(0, 16) : ''} />
          <FormField label="Location" name="location" maxLength={160} defaultValue={values.location ?? ''} hint="Campus, address, or 'Online'." />
          <ImageField className={styles.wide} label="Cover image" name="cover_image" folder="events" defaultValue={values.cover_image ?? ''} hint="Upload a file from your device, or paste a direct https image link." />
          <FormField className={styles.wide} label="Video link (optional)" name="video_url" type="url" defaultValue={values.video_url ?? ''} hint="YouTube, Vimeo or a direct https .mp4 link." />
          <FormField label="Description" as="textarea" name="description" required minLength={10} maxLength={8000} defaultValue={values.description} />
          <label className={styles.check}><input type="checkbox" name="published" defaultChecked={values.published ?? true} /> Published</label>
          <div className={styles.actions}>
            <Button type="submit" variant="dark">{editing ? 'Save changes' : 'Create event'}</Button>
            {editing && <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>}
          </div>
        </form>
      </Panel>
    </>
  )
}
