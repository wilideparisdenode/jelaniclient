import { useFetch } from '../../hooks/useFetch'
import StateMessage from '../common/StateMessage'
import CourseCard from './CourseCard'
import styles from './CourseGrid.module.css'

// Reusable grid. `category` is a category slug filter; `limit` trims the list.
export default function CourseGrid({ category, limit }) {
  const url = category ? `/courses?category=${encodeURIComponent(category)}` : '/courses'
  const { data: courses, loading, error } = useFetch(url, { select: (b) => b.courses, initial: [] })
  const visible = limit ? courses.slice(0, limit) : courses

  return (
    <>
      <StateMessage loading={loading} error={error} empty={!loading && !error && !visible.length} emptyText="No courses found." />
      <div className={styles.grid}>
        {visible.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </>
  )
}
