import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, User, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import CoursesDropdown from './CoursesDropdown'
import UpdatesDropdown from './UpdatesDropdown'
import ThemeToggle from '../common/ThemeToggle'
import logo from '../../assets/JelaniCon-Logo.png'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isAdmin, isStaff, avatarUrl, signOut } = useAuth()
  const close = () => setOpen(false)
  const dashboard = isAdmin ? '/admin' : isStaff ? '/tutor' : '/dashboard'
  const dashboardLabel = isAdmin ? 'Admin' : isStaff ? 'Tutor' : 'My learning'

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={close} aria-label="Jelani Consulting home">
          <img src={logo} alt="Jelani Consulting" className={styles.logo} />
        </Link>

        <button type="button" className={styles.toggle} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Primary">
          <CoursesDropdown onNavigate={close} />
          <UpdatesDropdown onNavigate={close} />
          <NavLink to="/support" onClick={close} className={({ isActive }) => (isActive ? styles.active : '')}>Customer Service</NavLink>
          <ThemeToggle />
          {isAuthenticated
            ? (
              <>
                <NavLink to={dashboard} onClick={close}>{dashboardLabel}</NavLink>
                <NavLink to="/profile" onClick={close} className={({ isActive }) => (isActive ? `${styles.avatarLink} ${styles.active}` : styles.avatarLink)} aria-label="My profile" title="My profile">
                  {avatarUrl ? <img src={avatarUrl} alt="" className={styles.avatar} /> : <User size={20} />}
                </NavLink>
                <button type="button" className={styles.link} onClick={() => { close(); signOut() }}>Sign out</button>
              </>
            )
            : <NavLink to="/login" onClick={close}>Sign in</NavLink>}
        </nav>
      </div>
    </header>
  )
}
