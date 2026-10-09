import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, ClipboardList, FileText, Folder, HelpCircle, Megaphone, MessageSquare, ShoppingCart, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './DashboardLayout.module.css'

// LMS-only navigation. No CMS items (Appearance, Plugins, Divi, System Tools).
export const ADMIN_NAV = [
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/categories', label: 'Categories', icon: Folder },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/students', label: 'Student Roster', icon: Users },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/posts', label: 'Posts', icon: FileText },
  { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { to: '/admin/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/admin/qa', label: 'Q&A', icon: HelpCircle },
]

export const STUDENT_NAV = [
  { to: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { to: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/dashboard/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/dashboard/qa', label: 'Q&A', icon: HelpCircle },
]

export default function DashboardLayout({ variant }) {
  const { user } = useAuth()
  const items = variant === 'admin' ? ADMIN_NAV : STUDENT_NAV
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.who}>{variant === 'admin' ? 'Administration' : 'My learning'}<small>{user?.fullName || user?.email}</small></p>
        <nav aria-label={variant === 'admin' ? 'Admin' : 'Student'}>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? `${styles.item} ${styles.active}` : styles.item)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className={styles.content}><Outlet /></section>
    </div>
  )
}
