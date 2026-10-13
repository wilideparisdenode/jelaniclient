import Hero from '../components/home/Hero'
import TrustedCompanies from '../components/home/TrustedCompanies'
import About from '../components/home/About'
import FeaturedCourses from '../components/home/FeaturedCourses'
import PathwaysSection from '../components/home/PathwaysSection'
import Branches from '../components/home/Branches'
import AlumniSuccess from '../components/home/AlumniSuccess'
import Testimonials from '../components/home/Testimonials'
import StaffGrid from '../components/home/StaffGrid'
import CtaBand from '../components/home/CtaBand'
import Faq from '../components/home/Faq'

// Composition only: each section owns its data and styles.
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <About />
      <FeaturedCourses />
      <PathwaysSection />
      <Branches />
      <AlumniSuccess />
      <Testimonials />
      <StaffGrid />
      <Faq />
      <CtaBand />
    </>
  )
}
