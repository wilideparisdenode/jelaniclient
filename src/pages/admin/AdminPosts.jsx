import { useState } from 'react'
import { useResource } from '../../hooks/useResource'
import { formatDate } from '../../lib/format'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import ImageField from '../../components/common/ImageField'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

// Admin-authored, public posts. Comments on them are moderated under "Comments".
export default function AdminPosts() {
  const posts = useResource('/admin/posts')
  const [editing, setEditing] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = {
      title: form.get('title'),
      excerpt: form.get('excerpt') || undefined,
      body: form.get('body'),
      cover_image: form.get('cover_image') || undefined,
      published: form.get('published') === 'on',
    }
    const ok = editing ? await posts.update(`/admin/posts/${editing.id}`, body) : await posts.create('/admin/posts', body)
    if (ok) { setEditing(null); event.target.reset() }
  }

  const values = editing ?? {}

  return (
    <>
      <PageTitle title="Posts" />
      <DataTable
        loading={posts.loading} error={posts.error} rows={posts.rows} empty="No posts yet."
        columns={[
          { key: 'title', header: 'Title' },
          { key: 'author_name', header: 'Author', render: (row) => row.author_name ?? '—' },
          { key: 'created_at', header: 'Created', render: (row) => formatDate(row.created_at) },
          { key: 'published', header: 'Status', render: (row) => <StatusBadge value={row.published ? 'approved' : 'pending'} /> },
        ]}
        actions={(row) => (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditing(row)}>Edit</Button>
            <Button size="sm" variant="outline" onClick={() => posts.update(`/admin/posts/${row.id}`, { published: !row.published })}>{row.published ? 'Unpublish' : 'Publish'}</Button>
            <Button size="sm" variant="danger" onClick={() => window.confirm(`Delete "${row.title}"?`) && posts.remove(`/admin/posts/${row.id}`)}>Delete</Button>
          </>
        )}
      />

      <Panel title={editing ? `Edit: ${editing.title}` : 'New post'}>
        <form key={editing?.id ?? 'new'} className={styles.form} onSubmit={submit}>
          <FormField label="Title" name="title" required minLength={3} maxLength={160} defaultValue={values.title} />
          <ImageField className={styles.wide} label="Cover image" name="cover_image" folder="posts" defaultValue={values.cover_image ?? ''} hint="Upload a file from your device, or paste a direct https image link." />
          <FormField label="Excerpt (shown on the list)" name="excerpt" maxLength={300} defaultValue={values.excerpt ?? ''} />
          <FormField label="Body" name="body" as="textarea" required minLength={10} maxLength={20000} defaultValue={values.body} />
          <label className={styles.check}><input type="checkbox" name="published" defaultChecked={values.published ?? true} /> Published</label>
          <div className={styles.actions}>
            <Button type="submit" variant="dark">{editing ? 'Save changes' : 'Create post'}</Button>
            {editing && <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>}
          </div>
        </form>
      </Panel>
    </>
  )
}
