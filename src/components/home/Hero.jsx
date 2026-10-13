import { useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../common/Button'
import styles from './Hero.module.css'

const SLIDES = [
  {
    kicker: 'Career-ready courses',
    title: 'Learn the skills that get you ',
    highlight: 'hired.',
    lead: 'Hands-on, instructor-led programmes in technology, data, design and marketing, built with the companies that hire our graduates.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Students collaborating in a classroom',
  },
  {
    kicker: 'Instructor-led',
    title: 'Taught by people who ',
    highlight: 'do the job.',
    lead: 'Every class is led by a working practitioner, so you learn the tools and habits that teams actually use — not just theory.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    alt: 'Instructor mentoring a small group',
  },
  {
    kicker: 'Hiring partners',
    title: 'Graduate into a role, not just a ',
    highlight: 'certificate.',
    lead: 'Our career services team introduces graduates directly to 120+ hiring partners, with portfolio capstones employers recognise.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    alt: 'Learners working on laptops at a workshop',
  },
  {
    kicker: 'Flexible learning',
    title: 'Study online or on ',
    highlight: 'campus.',
    lead: 'Join live online from anywhere, or learn in person at a campus branch. Same curriculum, same mentors, your schedule.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    alt: 'Graduate presenting a capstone project',
  },
]

const AUTOPLAY_MS = 6000

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [paused])

  const goTo = (next) => setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length)

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div
          className={styles.viewport}
          role="group"
          aria-roledescription="carousel"
          aria-label="Highlights"
          tabIndex={0}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') goTo(index - 1)
            if (event.key === 'ArrowRight') goTo(index + 1)
          }}
        >
          <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
            {SLIDES.map((slide, slideIndex) => {
              const Heading = slideIndex === index ? 'h1' : 'h2'
              return (
                <article
                  key={slide.image}
                  className={styles.slide}
                  aria-hidden={slideIndex !== index}
                  aria-roledescription="slide"
                  aria-label={`${slideIndex + 1} of ${SLIDES.length}`}
                >
                  <div className={styles.copy}>
                    <p className={styles.kicker}>{slide.kicker}</p>
                    <Heading>{slide.title}<em>{slide.highlight}</em></Heading>
                    <p className={styles.lead}>{slide.lead}</p>
                    <div className={styles.actions}>
                      <Button to="/courses" size="lg">Explore Courses <ArrowRight size={18} /></Button>
                      <Button to="/support" variant="light" size="lg">Talk to us</Button>
                    </div>
                  </div>
                  <img className={styles.image} src={slide.image} alt={slide.alt} loading={slideIndex === 0 ? 'eager' : 'lazy'} />
                </article>
              )
            })}
          </div>

          <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => goTo(index - 1)} aria-label="Previous slide"><ChevronLeft size={22} /></button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => goTo(index + 1)} aria-label="Next slide"><ChevronRight size={22} /></button>
        </div>

        <div className={styles.footer}>
          <ul className={styles.stats} aria-label="Highlights">
            <li><strong>92%</strong><span>graduate placement</span></li>
            <li><strong>3,500+</strong><span>alumni worldwide</span></li>
            <li><strong>120+</strong><span>hiring partners</span></li>
          </ul>
          <div className={styles.dots} role="tablist" aria-label="Choose slide">
            {SLIDES.map((slide, slideIndex) => (
              <button
                key={slide.image}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={slide.kicker}
                className={slideIndex === index ? styles.dotActive : styles.dot}
                onClick={() => goTo(slideIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
