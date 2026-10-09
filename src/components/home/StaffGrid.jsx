import { useFetch } from '../../hooks/useFetch'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import StateMessage from '../common/StateMessage'
import styles from './StaffGrid.module.css'

export default function StaffGrid() {
  const { data: staff, loading, error } = useFetch('/catalog/staff', { select: (b) => b.items, initial: [] })
  return (
    <Section id="staff" tone="surface">
      <SectionHeading eyebrow="Our team" title="Meet your instructors and staff" subtitle="Practitioners who teach what they do every day." />
      <StateMessage loading={loading} error={error} empty={!loading && !error && !staff.length} emptyText="Team profiles coming soon." />
      <div className={styles.grid}>
        {staff.map((person) => (
          <article key={person.id} className={styles.card}>
            {person.photo_url ? <img src={person.photo_url} alt={person.name} loading="lazy" /> : <div className={styles.initial}>{person.name[0]}</div>}
            <h3>{person.name}</h3>
            <p className={styles.title}>{person.title}</p>
            {person.bio && <p className={styles.bio}>{person.bio}</p>}
          </article>
        ))}
      </div>
    </Section>
  )
}
