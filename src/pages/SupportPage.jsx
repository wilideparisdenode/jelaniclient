import { Clock3, Mail, Phone } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import styles from './FormPage.module.css'

const channels = [
  { icon: Mail, title: 'Email', text: 'support@jelani.consulting', note: 'We reply within one business day.' },
  { icon: Phone, title: 'Phone', text: '+1 (555) 010-2030', note: 'Monday to Friday, 9am to 6pm.' },
  { icon: Clock3, title: 'Refunds & billing', text: 'Include your order number', note: 'Refund requests are handled by email.' },
]

export default function SupportPage() {
  return (
    <>
      <PageHeader title="Customer service" subtitle="Questions about registration, payments or your classroom? We are here to help." />
      <Section>
        <div className={styles.cards}>
          {channels.map(({ icon: Icon, title, text, note }) => (
            <article key={title} className={styles.card}>
              <Icon size={24} />
              <h3>{title}</h3>
              <p><strong>{text}</strong></p>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
