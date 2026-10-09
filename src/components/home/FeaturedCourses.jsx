import Section from '../common/Section'
import SectionHeading from '../common/SectionHeading'
import Button from '../common/Button'
import CourseGrid from './CourseGrid'
import styles from './FeaturedCourses.module.css'

export default function FeaturedCourses() {
  return (
    <Section id="courses">
      <SectionHeading eyebrow="Courses" title="Find the programme that fits your goals" subtitle="Every course includes mentorship, a capstone project and career support." />
      <CourseGrid limit={6} />
      <div className={styles.more}><Button to="/courses" variant="outline">Browse all courses</Button></div>
    </Section>
  )
}
