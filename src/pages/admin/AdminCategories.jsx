import { useResource } from '../../hooks/useResource'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import DataTable from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

export default function AdminCategories() {
  const categories = useResource('/admin/categories')

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const ok = await categories.create('/admin/categories', { name: data.name, description: data.description || undefined, sort_order: Number(data.sort_order) || 0 })
    if (ok) form.reset()
  }

  return (
    <>
      <PageTitle title="Categories" />
      <DataTable
        loading={categories.loading} error={categories.error} rows={categories.rows} empty="No categories yet."
        columns={[{ key: 'name', header: 'Name' }, { key: 'description', header: 'Description', render: (row) => row.description ?? '—' }, { key: 'sort_order', header: 'Order' }]}
        actions={(row) => <Button size="sm" variant="danger" onClick={() => window.confirm(`Delete "${row.name}"?`) && categories.remove(`/admin/categories/${row.id}`)}>Delete</Button>}
      />
      <Panel title="Add a category">
        <form className={styles.form} onSubmit={submit}>
          <FormField label="Name" name="name" required minLength={2} maxLength={80} />
          <FormField label="Description" name="description" maxLength={300} />
          <FormField label="Sort order" name="sort_order" type="number" min="0" defaultValue="0" />
          <div className={styles.actions}><Button type="submit" variant="dark">Create category</Button></div>
        </form>
      </Panel>
    </>
  )
}
