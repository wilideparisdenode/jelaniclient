import { Link } from 'react-router-dom'
import { CalendarDays, Clock3 } from 'lucide-react'
import { formatDate, formatPrice } from '../../lib/format'
import Button from '../common/Button'
import styles from './CourseCard.module.css'

// Summary card: title, description, upcoming registration start, tuition price.
export default function CourseCard({ course }) {
  const start = formatDate(course.registrationStart)
  return (
    <article className={styles.card}>
      <Link to={`/courses/${course.id}`} className={styles.media} aria-label={course.title}>
        {course.image ? <img src={course.image} alt="" loading="lazy" /> : <div className={styles.placeholder} />}
        {course.category && <span className={styles.badge}>{course.category.name}</span>}
      </Link>
      <div className={styles.body}>
        <h3><Link to={`/courses/${course.id}`}>{course.title}</Link></h3>
        <p className={styles.desc}>{course.description}</p>
        <ul className={styles.meta}>
          <li><Clock3 size={15} /> {course.duration}</li>
          <li><CalendarDays size={15} /> {start ? `Registration opens ${start}` : 'Dates to be announced'}</li>
        </ul>
        <div className={styles.footer}>
          <div className={styles.price}><small>Tuition</small><strong>{formatPrice(course.priceCents, course.currency)}</strong></div>
          <Button to={`/courses/${course.id}`} size="sm" variant="dark">View details</Button>
        </div>
      </div>
    </article>
  )
}
