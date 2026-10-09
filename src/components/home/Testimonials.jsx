import { Star } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import StateMessage from '../common/StateMessage'
import styles from './Testimonials.module.css'

export default function Testimonials() {
  const { data: reviews, loading, error } = useFetch('/catalog/testimonials', { select: (b) => b.items, initial: [] })
  return (
    <Section id="testimonials">
      <SectionHeading eyebrow="Student reviews" title="What our students say" />
      <StateMessage loading={loading} error={error} empty={!loading && !error && !reviews.length} emptyText="Reviews coming soon." />
      <div className={styles.grid}>
        {reviews.map((review) => (
          <figure key={review.id} className={styles.card}>
            <div className={styles.stars} role="img" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />)}
            </div>
            <blockquote>“{review.quote}”</blockquote>
            <figcaption><strong>{review.author}</strong>{review.course && <span>{review.course.title}</span>}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
