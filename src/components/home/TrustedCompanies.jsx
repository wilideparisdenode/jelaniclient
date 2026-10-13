import { useFetch } from '../../hooks/useFetch'
import StateMessage from '../common/StateMessage'
import styles from './TrustedCompanies.module.css'

// Partner logos from the `partners` table, scrolled as a seamless marquee.
export default function TrustedCompanies() {
  const { data: partners, loading, error } = useFetch('/catalog/partners', { select: (b) => b.items, initial: [] })
  const hasPartners = !loading && !error && partners.length > 0
  // Duplicate the list so the loop is seamless.
  const track = hasPartners ? [...partners, ...partners] : []

  return (
    <section className={styles.band} aria-labelledby="trusted-title">
      <div className={styles.inner}>
        <h2 id="trusted-title" className={styles.title}>Trusted by companies that hire our graduates</h2>
        <StateMessage loading={loading} error={error} empty={!loading && !error && !partners.length} emptyText="Partner companies coming soon." />
        {hasPartners && (
          <div className={styles.marquee}>
            <ul className={styles.track}>
              {track.map((partner, index) => (
                <li key={`${partner.id}-${index}`} aria-hidden={index >= partners.length}>
                  {partner.logo_url
                    ? <img src={partner.logo_url} alt={partner.name} loading="lazy" />
                    : <span className={styles.wordmark}>{partner.name}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
