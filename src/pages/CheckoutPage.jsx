import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import StateMessage from '../components/common/StateMessage'
import CheckoutForm from '../components/checkout/CheckoutForm'
import FeeBreakdown from '../components/checkout/FeeBreakdown'
import TrustBadges from '../components/checkout/TrustBadges'
import styles from './CheckoutPage.module.css'

// Protected route: the student is already signed in with Supabase Auth.
export default function CheckoutPage() {
  const { courseId } = useParams()
  const { data: course, loading, error } = useFetch(`/courses/${courseId}`, { select: (b) => b.course })

  return (
    <>
      <PageHeader title="Complete your registration" subtitle="Review your order and pay securely with Stripe." />
      <Section>
        {(loading || error || !course)
          ? <StateMessage loading={loading} error={error || (!course && 'Course not found.')} />
          : (
            <div className={styles.layout}>
              <div className={styles.panel}>
                <h2>Your details</h2>
                <CheckoutForm course={course} />
              </div>
              <aside className={styles.panel}>
                <h2>Order summary</h2>
                <p className={styles.course}>{course.title}</p>
                <FeeBreakdown courseId={course.id} title="Course tuition" />
                <TrustBadges />
                <p className={styles.fine}>You will be redirected to Stripe to enter your card details. Your place is confirmed once payment succeeds.</p>
              </aside>
            </div>
          )}
      </Section>
    </>
  )
}
