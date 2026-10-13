import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { useResource } from '../../hooks/useResource'
import { formatPrice } from '../../lib/format'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import ImageField from '../../components/common/ImageField'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

const lines = (text) => text.split('\n').map((line) => line.trim()).filter(Boolean)

// "Title | Description" per line -> [{title, description}]
const parsePathways = (text) => lines(text).map((line) => {
  const [title, ...rest] = line.split('|')
  return { title: title.trim(), description: rest.join('|').trim() }
})

export default function AdminCourses() {
  const courses = useResource('/courses/admin', 'courses')
  const categories = useFetch('/admin/categories', { select: (b) => b.items, initial: [] })
  const branches = useFetch('/catalog/branches', { select: (b) => b.items, initial: [] })
  const [editing, setEditing] = useState(null)

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = {
      title: form.get('title'),
      description: form.get('description'),
      duration: form.get('duration'),
      level: form.get('level'),
      priceCents: Math.round(Number(form.get('price')) * 100),
      categoryId: form.get('categoryId') || undefined,
      registrationStart: form.get('registrationStart') || undefined,
      image: form.get('image') || undefined,
      syllabus: lines(form.get('syllabus')),
      careerPathways: parsePathways(form.get('pathways')),
      branchIds: form.getAll('branchIds'),
      published: form.get('published') === 'on',
    }
    const ok = editing
      ? await courses.update(`/courses/admin/${editing.id}`, body)
      : await courses.create('/courses/admin', body)
    if (ok) { setEditing(null); event.target.reset() }
  }

  const values = editing ?? {}
  return (
    <>
      <PageTitle title="Courses" />
      <DataTable
        loading={courses.loading} error={courses.error} rows={courses.rows} empty="No courses yet."
        columns={[
          { key: 'title', header: 'Course' },
          { key: 'category', header: 'Category', render: (row) => row.category?.name ?? '—' },
          { key: 'price', header: 'Tuition', render: (row) => formatPrice(row.priceCents, row.currency) },
          { key: 'published', header: 'Status', render: (row) => <StatusBadge value={row.published ? 'approved' : 'pending'} /> },
        ]}
        actions={(row) => (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditing(row)}>Edit</Button>
            <Button size="sm" variant="danger" onClick={() => window.confirm(`Delete "${row.title}"?`) && courses.remove(`/courses/admin/${row.id}`)}>Delete</Button>
          </>
        )}
      />

      <Panel title={editing ? `Edit: ${editing.title}` : 'Add a course'}>
        <form key={editing?.id ?? 'new'} className={styles.form} onSubmit={submit}>
          <FormField label="Title" name="title" required minLength={3} maxLength={120} defaultValue={values.title} />
          <label className={styles.select}><span>Category</span>
            <select name="categoryId" defaultValue={values.categoryId ?? ''}>
              <option value="">Uncategorised</option>
              {categories.data.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <FormField label="Description" as="textarea" name="description" required minLength={10} maxLength={5000} defaultValue={values.description} />
          <FormField label="Duration" name="duration" required defaultValue={values.duration} />
          <FormField label="Level" name="level" required defaultValue={values.level} />
          <FormField label="Tuition (major units, e.g. 2400)" name="price" type="number" min="0" step="0.01" required hint="Set 0 for a free course." defaultValue={values.priceCents != null ? values.priceCents / 100 : ''} />
          <FormField label="Registration starts" name="registrationStart" type="date" defaultValue={values.registrationStart ?? ''} />
          <ImageField className={styles.wide} label="Course image" name="image" folder="courses" defaultValue={values.image ?? ''} hint="Upload a file from your device, or paste a direct https image link." />
          <FormField label="Syllabus (one item per line)" as="textarea" name="syllabus" required defaultValue={(values.syllabus ?? []).join('\n')} />
          <FormField label="Career pathways (Title | Description per line)" as="textarea" name="pathways" defaultValue={(values.careerPathways ?? []).map((p) => `${p.title} | ${p.description ?? ''}`).join('\n')} />
          <fieldset className={styles.fieldset}>
            <legend>Branches</legend>
            {branches.data.map((branch) => (
              <label key={branch.id} className={styles.check}>
                <input type="checkbox" name="branchIds" value={branch.id} defaultChecked={values.branches?.some((b) => b.id === branch.id)} /> {branch.name}
              </label>
            ))}
          </fieldset>
          <label className={styles.check}><input type="checkbox" name="published" defaultChecked={values.published ?? true} /> Published</label>
          <div className={styles.actions}>
            <Button type="submit" variant="dark">{editing ? 'Save changes' : 'Create course'}</Button>
            {editing && <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>}
          </div>
        </form>
      </Panel>
    </>
  )
}
