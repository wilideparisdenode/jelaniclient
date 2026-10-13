import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Button from '../common/Button'
import styles from './Hero.module.css'

const SLIDES = [
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', alt: 'Students collaborating in a classroom' },
  { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', alt: 'Instructor mentoring a small group' },
  { src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', alt: 'Learners working on laptops at a workshop' },
  { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', alt: 'Graduate presenting a capstone project' },
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [index])

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

        <div className={styles.media}>
          <div className={styles.slides}>
            {SLIDES.map((slide, slideIndex) => (
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                className={slideIndex === index ? styles.active : ''}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
          <div className={styles.dots} role="tablist" aria-label="Hero images">
            {SLIDES.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={slide.alt}
                className={slideIndex === index ? styles.dotActive : styles.dot}
                onClick={() => setIndex(slideIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
