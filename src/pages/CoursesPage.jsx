import { useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import CourseGrid from '../components/home/CourseGrid'
import styles from './CoursesPage.module.css'

export default function CoursesPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const { data: categories } = useFetch('/catalog/categories', { select: (b) => b.items, initial: [] })
  const select = (slug) => (slug ? setParams({ category: slug }) : setParams({}))

  return (
    <>
      <PageHeader title="All courses" subtitle="Filter by category to find the right programme." />
      <Section>
        <div className={styles.filters} role="group" aria-label="Filter by category">
          <button type="button" className={!category ? styles.on : ''} onClick={() => select('')}>All</button>
          {categories.map((item) => (
            <button key={item.id} type="button" className={category === item.slug ? styles.on : ''} onClick={() => select(item.slug)}>{item.name}</button>
          ))}
        </div>
        <CourseGrid category={category} />
      </Section>
    </>
  )
}
