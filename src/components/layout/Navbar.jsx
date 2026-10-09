import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import CoursesDropdown from './CoursesDropdown'
import logo from '../../assets/JelaniCon-Logo.png'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isAdmin, signOut } = useAuth()
  const close = () => setOpen(false)

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
          <NavLink to="/posts" onClick={close} className={({ isActive }) => (isActive ? styles.active : '')}>News</NavLink>
          <NavLink to="/support" onClick={close} className={({ isActive }) => (isActive ? styles.active : '')}>Customer Service</NavLink>
          {isAuthenticated
            ? (
              <>
                <NavLink to={isAdmin ? '/admin' : '/dashboard'} onClick={close}>{isAdmin ? 'Admin' : 'My learning'}</NavLink>
                <button type="button" className={styles.link} onClick={() => { close(); signOut() }}>Sign out</button>
              </>
            )
            : <NavLink to="/login" onClick={close}>Sign in</NavLink>}
        </nav>
      </div>
    </header>
  )
}
