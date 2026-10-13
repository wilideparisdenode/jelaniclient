import { useResource } from '../../hooks/useResource'
import { useAuth } from '../../context/AuthContext'
import { useConfirm } from '../../context/ToastContext'
import { formatDate } from '../../lib/format'
import DataTable from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

const ROLES = ['student', 'tutor', 'admin']

// Admin management of user roles. Accounts are created by the users themselves
// (self sign-up); admins only promote/demote between student, tutor and admin.
export default function AdminUsers() {
  const users = useResource('/admin/users')
  const { user: me } = useAuth()
  const confirm = useConfirm()

  const changeRole = async (row, role) => {
    if (role === 'admin') {
      const ok = await confirm({
        title: 'Grant admin access',
        message: `Give ${row.full_name || row.email} full administrator access? They will be able to manage users, payments and all content.`,
        confirmLabel: 'Grant admin',
      })
      if (!ok) return
    }
    await users.update(`/admin/users/${row.id}/role`, { role }, { success: `${row.full_name || row.email} is now a ${role}.` })
  }

  return (
    <>
      <PageTitle title="Users" />
      <Panel title="Roles">
        <p className={styles.check} style={{ marginBottom: 12 }}>
          Students, tutors and admins share one sign-up. Change a user&apos;s role here:
          <strong> students</strong> learn, <strong>tutors</strong> author courses, posts and quizzes,
          <strong> admins</strong> manage everything.
        </p>
        <DataTable
          loading={users.loading} error={users.error} rows={users.rows} empty="No users yet. New sign-ups appear here."
          columns={[
            { key: 'full_name', header: 'Name', render: (row) => row.full_name ?? '—' },
            { key: 'email', header: 'Email', render: (row) => row.email ?? '—' },
            { key: 'created_at', header: 'Joined', render: (row) => formatDate(row.created_at) },
            {
              key: 'role',
              header: 'Role',
              render: (row) => (
                <select
                  value={row.role}
                  disabled={row.id === me?.id}
                  aria-label={`Role for ${row.email ?? row.full_name ?? 'user'}`}
                  onChange={(event) => changeRole(row, event.target.value)}
                >
                  {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              ),
            },
          ]}
        />
      </Panel>
    </>
  )
}
