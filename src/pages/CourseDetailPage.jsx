import { useParams } from 'react-router-dom'
import { CalendarDays, Check, Clock3, MapPin, Video } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { formatDate, formatPrice } from '../lib/format'
import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import StateMessage from '../components/common/StateMessage'
import { CoursePathways } from '../components/home/CareerPathways'
import styles from './CourseDetailPage.module.css'

export default function CourseDetailPage() {
  const { id } = useParams()
  const { data: course, loading, error } = useFetch(`/courses/${id}`, { select: (b) => b.course })

  if (loading || error || !course) {
    return <Section><StateMessage loading={loading} error={error || (!course && 'Course not found.')} /></Section>
  }
  const start = formatDate(course.registrationStart)

  return (
    <>
      <PageHeader title={course.title} subtitle={course.category?.name} />
      <Section>
        <div className={styles.layout}>
          <div className={styles.main}>
            {course.image && <img className={styles.cover} src={course.image} alt="" />}
            <h2>About this course</h2>
            <p>{course.description}</p>
            <h2>What you will learn</h2>
            <ul className={styles.checks}>
              {course.syllabus.map((item) => <li key={item}><Check size={16} /> {item}</li>)}
            </ul>
            <h2>Career pathways</h2>
            <CoursePathways pathways={course.careerPathways} />
            <h2>Available branches</h2>
            {course.branches.length
              ? (
                <ul className={styles.branches}>
                  {course.branches.map((branch) => (
                    <li key={branch.id}>
                      {branch.mode === 'virtual' ? <Video size={16} /> : <MapPin size={16} />}
                      <span><strong>{branch.name}</strong>{branch.city ? ` — ${branch.city}` : ''}</span>
                    </li>
                  ))}
                </ul>
              )
              : <p className={styles.muted}>Branch details coming soon.</p>}
          </div>

          <aside className={styles.sidebar}>
            <p className={styles.price}>{formatPrice(course.priceCents, course.currency)}</p>
            <ul>
              <li><Clock3 size={16} /> {course.duration}</li>
              <li><CalendarDays size={16} /> {start ? `Registration opens ${start}` : 'Dates to be announced'}</li>
              <li><Check size={16} /> {course.level}</li>
            </ul>
            <Button to={`/checkout/${course.id}`} size="lg" block>{course.priceCents > 0 ? 'Register now' : 'Enrol free'}</Button>
            <small>{course.priceCents > 0 ? 'Secure payment powered by Stripe.' : 'No payment required — enrol instantly.'}</small>
          </aside>
        </div>
      </Section>
    </>
  )
}
