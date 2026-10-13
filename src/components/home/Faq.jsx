import { ChevronDown } from 'lucide-react'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import styles from './Faq.module.css'

const FAQS = [
  { q: 'Do I need any experience to join a course?', a: 'Most programmes are beginner friendly and list their level on the course page. Our free Introduction to Digital Skills course is designed for complete beginners — no prior experience required.' },
  { q: 'How does payment work?', a: 'You check out securely with Stripe using a card. Your place is confirmed the moment the payment succeeds, and you can see the order status in your dashboard. Some introductory courses are completely free.' },
  { q: 'Can I pay in instalments?', a: 'Instalment plans are available on selected career programmes. Contact our team through Customer Service and we will match you with a plan that fits your schedule.' },
  { q: 'Are classes online or on campus?', a: 'We offer both. Every course page lists the available branches, including physical campuses and a live-online option, so you can pick what suits you.' },
  { q: 'What do I get when I finish?', a: 'You complete a portfolio capstone that employers recognise, keep lifetime access to your course materials, and can request a certificate of completion from your dashboard.' },
  { q: 'How do hiring partners work?', a: 'Our career services team introduces graduates to hiring partners who interview directly with us. Alumni stories on the home page show where recent graduates have landed.' },
]

export default function Faq() {
  return (
    <Section id="faq" tone="surface">
      <SectionHeading
        eyebrow="Questions"
        title="Frequently asked questions"
        subtitle="Everything you need to know before you enrol. Still stuck? Our team is one message away."
      />
      <div className={styles.list}>
        {FAQS.map((item) => (
          <details key={item.q} className={styles.item}>
            <summary>
              {item.q}
              <ChevronDown size={18} className={styles.chevron} />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
