import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { useResource } from '../../hooks/useResource'
import { formatDate } from '../../lib/format'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import PageTitle from '../../components/dashboard/PageTitle'
import StateMessage from '../../components/common/StateMessage'
import styles from './student.module.css'

// Ask a question in a course the student is enrolled in; see answers from staff.
export default function StudentQa() {
  const orders = useFetch('/student/orders', { select: (b) => b.orders, initial: [] })
  const qa = useResource('/student/qa')
  const [busy, setBusy] = useState(false)

  const enrolled = orders.data.filter((order) => order.status === 'confirmed')
  const courses = enrolled.filter((order, index) => enrolled.findIndex((other) => other.courseId === order.courseId) === index)

  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setBusy(true)
    const ok = await qa.create('/student/qa', { courseId: data.courseId, question: data.question })
    setBusy(false)
    if (ok) form.reset()
  }

  return (
    <>
      <PageTitle title="Q&A" />

      {courses.length > 0 && (
        <form className={styles.form} onSubmit={submit} style={{ marginBottom: 24 }}>
          <label className={styles.select}>
            <span>Course</span>
            <select name="courseId" required defaultValue="">
              <option value="" disabled>Select a course</option>
              {courses.map((order) => <option key={order.courseId} value={order.courseId}>{order.course?.title ?? order.courseId}</option>)}
            </select>
          </label>
          <FormField label="Your question" name="question" as="textarea" required minLength={5} maxLength={2000} />
          {qa.error && <p className={styles.error} role="alert">{qa.error}</p>}
          <div><Button type="submit" variant="dark" disabled={busy}>{busy ? 'Sending…' : 'Ask a question'}</Button></div>
        </form>
      )}

      <StateMessage loading={qa.loading} error={orders.error} empty={!qa.loading && !qa.error && !qa.rows.length} emptyText="No questions yet. Be the first to ask." />
      <div className={styles.list}>
        {qa.rows.map((item) => (
          <article key={item.id} className={styles.item}>
            <h3>{item.question}</h3>
            <small>{item.course?.title ?? 'General'} · asked {formatDate(item.created_at)}</small>
            {item.answer
              ? <p className={styles.body}><strong>Answer:</strong> {item.answer}</p>
              : <p className={styles.done}>Awaiting an answer from our team.</p>}
          </article>
        ))}
      </div>
    </>
  )
}
