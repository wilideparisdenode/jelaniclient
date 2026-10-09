import { useFetch } from '../../hooks/useFetch'
import StateMessage from '../common/StateMessage'
import styles from './TrustedCompanies.module.css'

// Partner logos from the `partners` table. Falls back to the company name when no logo is set.
export default function TrustedCompanies() {
  const { data: partners, loading, error } = useFetch('/catalog/partners', { select: (b) => b.items, initial: [] })

  return (
    <section className={styles.band} aria-labelledby="trusted-title">
      <div className={styles.inner}>
        <h2 id="trusted-title" className={styles.title}>Trusted by companies that hire our graduates</h2>
        <StateMessage loading={loading} error={error} empty={!loading && !error && !partners.length} emptyText="Partner companies coming soon." />
        <ul className={styles.logos}>
          {partners.map((partner) => (
            <li key={partner.id}>
              {partner.logo_url
                ? <img src={partner.logo_url} alt={partner.name} loading="lazy" />
                : <span className={styles.wordmark}>{partner.name}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
