import { useFetch } from '../../hooks/useFetch'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import StateMessage from '../common/StateMessage'
import styles from './AlumniSuccess.module.css'

export default function AlumniSuccess() {
  const { data: alumni, loading, error } = useFetch('/catalog/alumni', { select: (b) => b.items, initial: [] })
  return (
    <Section id="alumni" tone="surface">
      <SectionHeading eyebrow="Alumni success" title="Graduates who made the leap" subtitle="Real stories from people who changed careers with us." />
      <StateMessage loading={loading} error={error} empty={!loading && !error && !alumni.length} emptyText="Alumni stories coming soon." />
      <div className={styles.grid}>
        {alumni.map((person) => (
          <article key={person.id} className={styles.card}>
            <div className={styles.head}>
              {person.photo_url ? <img src={person.photo_url} alt={person.name} loading="lazy" /> : <span className={styles.initial}>{person.name[0]}</span>}
              <div>
                <h3>{person.name}</h3>
                <p className={styles.role}>{person.role_title}{person.company ? ` · ${person.company}` : ''}</p>
              </div>
            </div>
            <blockquote>“{person.story}”</blockquote>
            {person.course && <p className={styles.course}>Graduate of {person.course.title}</p>}
          </article>
        ))}
      </div>
    </Section>
  )
}
