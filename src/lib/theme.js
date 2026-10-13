// Theme helpers: persisted in localStorage, falling back to the OS preference.
const KEY = 'jelani-theme'

export function preferredTheme() {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch { /* storage blocked */ }
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  try { localStorage.setItem(KEY, next) } catch { /* storage blocked */ }
  return next
}
