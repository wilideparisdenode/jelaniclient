import { useFetch } from '../../hooks/useFetch'
import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import StateMessage from '../common/StateMessage'
import CareerPathways from './CareerPathways'

export default function PathwaysSection() {
  const { data: courses, loading, error } = useFetch('/courses', { select: (b) => b.courses, initial: [] })
  return (
    <Section id="pathways" tone="surface">
      <SectionHeading eyebrow="Career pathways" title="Where each course can take you" subtitle="See the roles our graduates move into after each programme." />
      <StateMessage loading={loading} error={error} />
      <CareerPathways courses={courses} />
    </Section>
  )
}
