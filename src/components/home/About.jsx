import { Briefcase, Compass, Users } from 'lucide-react'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import styles from './About.module.css'

const pillars = [
  { icon: Compass, title: 'Our mission', text: 'To make career-changing education accessible, practical and directly connected to real jobs.' },
  { icon: Users, title: 'Learn with people', text: 'Small cohorts, mentor-led classes and a community that keeps you accountable.' },
  { icon: Briefcase, title: 'Built with employers', text: 'Curriculum shaped by hiring partners, finishing with portfolio work employers recognise.' },
]

export default function About() {
  return (
    <Section id="about" tone="surface">
      <SectionHeading
        eyebrow="About us"
        title="Education designed around your career"
        subtitle="Jelani Consulting started with a simple idea: skills are best learned by doing, alongside people who do the work every day."
      />
      <div className={styles.grid}>
        {pillars.map(({ icon: Icon, title, text }) => (
          <article key={title} className={styles.card}>
            <span className={styles.icon}><Icon size={24} /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
