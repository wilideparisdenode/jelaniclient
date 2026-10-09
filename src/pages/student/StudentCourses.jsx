import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import Button from '../../components/common/Button'
import PageTitle from '../../components/dashboard/PageTitle'
import StateMessage from '../../components/common/StateMessage'
import { formatDate } from '../../lib/format'
import styles from './student.module.css'

// "My Courses" = courses the student has a confirmed (paid) order for.
export default function StudentCourses() {
  const { data: orders, loading, error } = useFetch('/student/orders', { select: (b) => b.orders, initial: [] })
  const enrolled = orders.filter((order) => order.status === 'confirmed')

  return (
    <>
      <PageTitle title="My Courses" />
      <StateMessage loading={loading} error={error} empty={!loading && !error && !enrolled.length} emptyText="You are not enrolled in any course yet." />
      <div className={styles.grid}>
        {enrolled.map((order) => (
          <article key={order.id} className={styles.card}>
            <h3><Link to={`/courses/${order.courseId}`}>{order.course?.title ?? 'Course'}</Link></h3>
            <p className={styles.meta}>Enrolled {formatDate(order.createdAt)}</p>
            <div className={styles.cta}>
              <Button to={`/courses/${order.courseId}`} size="sm" variant="dark">Open course</Button>
              <Button to="/dashboard/quizzes" size="sm" variant="outline">Quizzes</Button>
            </div>
          </article>
        ))}
      </div>
      {!loading && !error && !enrolled.length && (
        <div className={styles.cta}><Button to="/courses" variant="dark">Browse courses</Button></div>
      )}
    </>
  )
}
