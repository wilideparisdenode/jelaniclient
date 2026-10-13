import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import styles from './UpdatesDropdown.module.css'

// "Updates" groups the public news/blog feed and the events calendar.
const LINKS = [
  { to: '/posts', label: 'News & Blog', hint: 'Announcements, guides and stories' },
  { to: '/events', label: 'Events', hint: 'Open days, workshops and media' },
]

export default function UpdatesDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutside = (event) => { if (!ref.current?.contains(event.target)) setOpen(false) }
    const esc = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', closeOnOutside); document.removeEventListener('keydown', esc) }
  }, [open])

  const go = () => { setOpen(false); onNavigate?.() }

  return (
    <div className={styles.wrap} ref={ref}>
      <button type="button" className={styles.trigger} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>
        Updates <ChevronDown size={16} className={open ? styles.flip : ''} />
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={styles.item} role="menuitem" onClick={go}>
              <strong>{link.label}</strong>
              <small>{link.hint}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
