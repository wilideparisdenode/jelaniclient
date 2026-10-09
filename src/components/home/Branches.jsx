import { MapPin, Video } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import StateMessage from '../common/StateMessage'
import styles from './Branches.module.css'

// Physical campuses and virtual classrooms.
export default function Branches() {
  const { data: branches, loading, error } = useFetch('/catalog/branches', { select: (b) => b.items, initial: [] })
  return (
    <Section id="branches">
      <SectionHeading eyebrow="Branches" title="Study on campus or online" subtitle="Choose the format that suits your schedule. Every branch offers the same curriculum and career support." />
      <StateMessage loading={loading} error={error} empty={!loading && !error && !branches.length} emptyText="Branch information coming soon." />
      <div className={styles.grid}>
        {branches.map((branch) => {
          const virtual = branch.mode === 'virtual'
          const Icon = virtual ? Video : MapPin
          return (
            <article key={branch.id} className={styles.card}>
              <span className={`${styles.tag} ${virtual ? styles.virtual : ''}`}><Icon size={14} /> {virtual ? 'Virtual' : 'Physical'}</span>
              <h3>{branch.name}</h3>
              {(branch.address || branch.city) && <p className={styles.address}>{[branch.address, branch.city].filter(Boolean).join(', ')}</p>}
              {branch.description && <p>{branch.description}</p>}
            </article>
          )
        })}
      </div>
    </Section>
  )
}
