import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import styles from './CoursesDropdown.module.css'

// Course categories and their courses are fetched live from the API (Supabase).
export default function CoursesDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const categories = useFetch('/catalog/categories', { select: (b) => b.items, initial: [] })
  const courses = useFetch('/courses', { select: (b) => b.courses, initial: [] })

  useEffect(() => {
    if (!open) return
    const close = (event) => { if (!ref.current?.contains(event.target)) setOpen(false) }
    const esc = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  const go = () => { setOpen(false); onNavigate?.() }
  const loading = categories.loading || courses.loading
  const error = categories.error || courses.error
  const groups = categories.data
    .map((category) => ({ ...category, courses: courses.data.filter((course) => course.categoryId === category.id) }))
    .filter((group) => group.courses.length)

  return (
    <div className={styles.wrap} ref={ref}>
      <button type="button" className={styles.trigger} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        Courses <ChevronDown size={16} className={open ? styles.flip : ''} />
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {loading && <p className={styles.note}>Loading courses…</p>}
          {error && <p className={styles.note}>Could not load courses.</p>}
          {!loading && !error && !groups.length && <p className={styles.note}>No courses available yet.</p>}
          {groups.map((group) => (
            <div key={group.id} className={styles.group}>
              <Link to={`/courses?category=${group.slug}`} className={styles.groupTitle} role="menuitem" onClick={go}>{group.name}</Link>
              <ul>
                {group.courses.map((course) => (
                  <li key={course.id}><Link to={`/courses/${course.id}`} role="menuitem" onClick={go}>{course.title}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <Link to="/courses" className={styles.all} role="menuitem" onClick={go}>View all courses →</Link>
        </div>
      )}
    </div>
  )
}
