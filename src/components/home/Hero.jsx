import { ArrowRight } from 'lucide-react'
import Button from '../common/Button'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Career-ready courses</p>
          <h1>Learn the skills that get you <em>hired.</em></h1>
          <p className={styles.lead}>
            Hands-on, instructor-led programmes in technology, data, design and marketing,
            built with the companies that hire our graduates.
          </p>
          <div className={styles.actions}>
            <Button to="/courses" size="lg">Explore Courses <ArrowRight size={18} /></Button>
            <Button href="#about" variant="light" size="lg">Learn more</Button>
          </div>
          <ul className={styles.stats} aria-label="Highlights">
            <li><strong>92%</strong><span>graduate placement</span></li>
            <li><strong>3,500+</strong><span>alumni worldwide</span></li>
            <li><strong>120+</strong><span>hiring partners</span></li>
          </ul>
        </div>
        <img
          className={styles.image}
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
          alt="Students collaborating in a classroom"
        />
      </div>
    </section>
  )
}
