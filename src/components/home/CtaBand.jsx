import Button from '../common/Button'
import Section from '../common/Section'
import styles from './CtaBand.module.css'

export default function CtaBand() {
  return (
    <Section tone="dark">
      <div className={styles.wrap}>
        <h2>Ready to start your next chapter?</h2>
        <p>Create a free account, pick a course and secure your place today.</p>
        <div className={styles.actions}>
          <Button to="/register" size="lg">Create your account</Button>
          <Button to="/courses" variant="light" size="lg">Explore Courses</Button>
        </div>
      </div>
    </Section>
  )
}
