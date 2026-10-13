import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, Calendar, ClipboardList, FileText, Folder, HelpCircle, Megaphone, MessageSquare, ShoppingCart, User, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import styles from './DashboardLayout.module.css'

// Admin: full LMS management.
export const ADMIN_NAV = [
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/categories', label: 'Categories', icon: Folder },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/students', label: 'Enrollments', icon: Users },
  { to: '/admin/users', label: 'Users', icon: User },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/posts', label: 'Posts', icon: FileText },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/comments', label: 'Comments', icon: MessageSquare },
  { to: '/admin/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/admin/qa', label: 'Q&A', icon: HelpCircle },
]

// Tutor: content authoring only (courses, quizzes, posts, announcements, events, Q&A).
export const TUTOR_NAV = [
  { to: '/tutor/courses', label: 'Courses', icon: BookOpen },
  { to: '/tutor/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/tutor/posts', label: 'Posts', icon: FileText },
  { to: '/tutor/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/tutor/events', label: 'Events', icon: Calendar },
  { to: '/tutor/qa', label: 'Q&A', icon: HelpCircle },
]

export const STUDENT_NAV = [
  { to: '/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { to: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/dashboard/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/dashboard/quizzes', label: 'Quizzes', icon: ClipboardList },
  { to: '/dashboard/qa', label: 'Q&A', icon: HelpCircle },
]

const NAV = { admin: ADMIN_NAV, tutor: TUTOR_NAV, student: STUDENT_NAV }
const TITLE = { admin: 'Administration', tutor: 'Tutor studio', student: 'My learning' }

export default function DashboardLayout({ variant = 'student' }) {
  const { user } = useAuth()
  const items = NAV[variant] ?? STUDENT_NAV
  const ariaLabel = TITLE[variant] ?? 'Dashboard'

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <p className={styles.who}>{ariaLabel}<small>{user?.fullName || user?.email}</small></p>
        <nav aria-label={ariaLabel}>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? `${styles.item} ${styles.active}` : styles.item)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <NavLink to="/profile" className={({ isActive }) => (isActive ? `${styles.item} ${styles.active}` : styles.item)}>
            <User size={18} /> Profile
          </NavLink>
        </nav>
      </aside>
      <section className={styles.content}><Outlet /></section>
    </div>
  )
}
