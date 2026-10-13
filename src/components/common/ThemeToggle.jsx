import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme } from '../../lib/theme'
import styles from './ThemeToggle.module.css'

// Global dark/light switch. Reads the theme already applied by the inline boot script.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'))

  const toggle = () => setTheme(applyTheme(theme === 'dark' ? 'light' : 'dark'))

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
