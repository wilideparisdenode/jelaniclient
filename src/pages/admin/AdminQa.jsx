import { useState } from 'react'
import { useResource } from '../../hooks/useResource'
import { formatDate } from '../../lib/format'
import Button from '../../components/common/Button'
import PageTitle from '../../components/dashboard/PageTitle'
import StateMessage from '../../components/common/StateMessage'
import styles from './admin.module.css'

// Student questions across all courses. Answering stores the reply and stamps answered_at.
export default function AdminQa() {
  const qa = useResource('/admin/qa')
  const [drafts, setDrafts] = useState({})

  const answer = async (row) => {
    const text = (drafts[row.id] ?? '').trim()
    if (!text) return
    const ok = await qa.update(`/admin/qa/${row.id}`, { answer: text })
    if (ok) setDrafts((current) => ({ ...current, [row.id]: '' }))
  }

  return (
    <>
      <PageTitle title="Q&A" />
      <StateMessage loading={qa.loading} error={qa.error} empty={!qa.loading && !qa.error && !qa.rows.length} emptyText="No questions yet." />
      <div className={styles.stack}>
        {qa.rows.map((row) => (
          <article key={row.id} className={styles.qa}>
            <h3>{row.question}</h3>
            <small>{row.author} · {row.course?.title ?? 'All courses'} · {formatDate(row.created_at)}</small>
            {row.answer
              ? <p className={styles.answer}>{row.answer}</p>
              : (
                <div className={styles.answerRow}>
                  <textarea
                    value={drafts[row.id] ?? ''}
                    onChange={(event) => setDrafts((current) => ({ ...current, [row.id]: event.target.value }))}
                    placeholder="Write your answer…"
                    maxLength={4000}
                  />
                  <Button size="sm" variant="dark" onClick={() => answer(row)}>Answer</Button>
                </div>
              )}
            <div className={styles.actions}>
              <Button size="sm" variant="danger" onClick={() => window.confirm('Delete this question?') && qa.remove(`/admin/qa/${row.id}`)}>Delete</Button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
