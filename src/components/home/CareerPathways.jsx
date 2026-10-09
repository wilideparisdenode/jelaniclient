import { Link } from 'react-router-dom'
import { Route } from 'lucide-react'
import styles from './CareerPathways.module.css'

// Career pathways for one course (`course.careerPathways` jsonb), or for all courses when given a list.
export function CoursePathways({ pathways = [] }) {
  if (!pathways.length) return <p className={styles.empty}>Career pathways for this course will be published soon.</p>
  return (
    <ol className={styles.steps}>
      {pathways.map((pathway, index) => (
        <li key={pathway.title}>
          <span className={styles.num}>{index + 1}</span>
          <div><h4>{pathway.title}</h4>{pathway.description && <p>{pathway.description}</p>}</div>
        </li>
      ))}
    </ol>
  )
}

// Home-page overview: pathways grouped per course.
export default function CareerPathways({ courses }) {
  const withPaths = courses.filter((course) => course.careerPathways.length)
  if (!withPaths.length) return null
  return (
    <div className={styles.overview}>
      {withPaths.map((course) => (
        <article key={course.id} className={styles.panel}>
          <header>
            <Route size={20} />
            <h3><Link to={`/courses/${course.id}`}>{course.title}</Link></h3>
          </header>
          <ul>
            {course.careerPathways.map((pathway) => (
              <li key={pathway.title}><strong>{pathway.title}</strong>{pathway.description && <span>{pathway.description}</span>}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
