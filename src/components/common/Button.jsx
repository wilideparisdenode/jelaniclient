import { Link } from 'react-router-dom'
import styles from './Button.module.css'

// Renders a <Link>, <a> or <button> with consistent styling.
export default function Button({ to, href, variant = 'primary', size = 'md', block = false, className = '', children, ...rest }) {
  const classes = [styles.button, styles[variant], styles[size], block ? styles.block : '', className].filter(Boolean).join(' ')
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>
  if (href) return <a href={href} className={classes} {...rest}>{children}</a>
  return <button type="button" className={classes} {...rest}>{children}</button>
}
