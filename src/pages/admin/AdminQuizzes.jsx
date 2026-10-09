import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { useResource } from '../../hooks/useResource'
import Button from '../../components/common/Button'
import FormField from '../../components/common/FormField'
import DataTable, { StatusBadge } from '../../components/dashboard/DataTable'
import PageTitle from '../../components/dashboard/PageTitle'
import Panel from '../../components/dashboard/Panel'
import styles from './admin.module.css'

const emptyQuestion = () => ({ prompt: '', options: ['', ''], answerIndex: 0 })

// Admin quiz builder. Questions are stored as jsonb [{prompt, options[], answerIndex}].
export default function AdminQuizzes() {
  const quizzes = useResource('/admin/quizzes')
  const courses = useFetch('/courses/admin', { select: (b) => b.courses, initial: [] })
  const [editing, setEditing] = useState(null)
  const [questions, setQuestions] = useState([emptyQuestion()])

  const reset = () => { setEditing(null); setQuestions([emptyQuestion()]) }
  const startEdit = (quiz) => {
    setEditing(quiz)
    setQuestions(quiz.questions?.length ? quiz.questions.map((q) => ({ ...q, options: [...q.options] })) : [emptyQuestion()])
  }

  const patchQuestion = (index, patch) => setQuestions((current) => current.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  const addQuestion = () => setQuestions((current) => [...current, emptyQuestion()])
  const removeQuestion = (index) => setQuestions((current) => current.filter((_, i) => i !== index))
  const setOption = (qIndex, oIndex, value) => setQuestions((current) => current.map((q, i) => (i === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) } : q)))
  const addOption = (qIndex) => setQuestions((current) => current.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ''] } : q)))
  const removeOption = (qIndex, oIndex) => setQuestions((current) => current.map((q, i) => {
    if (i !== qIndex) return q
    const options = q.options.filter((_, j) => j !== oIndex)
    return { ...q, options, answerIndex: Math.min(q.answerIndex, options.length - 1) }
  }))

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const body = {
      course_id: form.get('course_id'),
      title: form.get('title'),
      published: form.get('published') === 'on',
      questions: questions.map((q) => ({ prompt: q.prompt, options: q.options, answerIndex: Number(q.answerIndex) })),
    }
    const ok = editing ? await quizzes.update(`/admin/quizzes/${editing.id}`, body) : await quizzes.create('/admin/quizzes', body)
    if (ok) { reset(); event.target.reset() }
  }

  const values = editing ?? {}

  return (
    <>
      <PageTitle title="Quizzes" />
      <DataTable
        loading={quizzes.loading} error={quizzes.error} rows={quizzes.rows} empty="No quizzes yet."
        columns={[
          { key: 'title', header: 'Quiz' },
          { key: 'course', header: 'Course', render: (row) => row.course?.title ?? '—' },
          { key: 'questions', header: 'Questions', render: (row) => row.questions?.length ?? 0 },
          { key: 'published', header: 'Status', render: (row) => <StatusBadge value={row.published ? 'approved' : 'pending'} /> },
        ]}
        actions={(row) => (
          <>
            <Button size="sm" variant="outline" onClick={() => startEdit(row)}>Edit</Button>
            <Button size="sm" variant="outline" onClick={() => quizzes.update(`/admin/quizzes/${row.id}`, { published: !row.published })}>{row.published ? 'Unpublish' : 'Publish'}</Button>
            <Button size="sm" variant="danger" onClick={() => window.confirm(`Delete "${row.title}"?`) && quizzes.remove(`/admin/quizzes/${row.id}`)}>Delete</Button>
          </>
        )}
      />

      <Panel title={editing ? `Edit: ${editing.title}` : 'Add a quiz'}>
        <form key={editing?.id ?? 'new'} className={styles.form} onSubmit={submit}>
          <label className={styles.select}><span>Course</span>
            <select name="course_id" required defaultValue={values.course_id ?? ''}>
              <option value="" disabled>Select a course</option>
              {courses.data.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
          </label>
          <FormField label="Quiz title" name="title" required minLength={3} maxLength={140} defaultValue={values.title} />

          <div className={styles.questions}>
            {questions.map((question, qIndex) => (
              <fieldset key={qIndex} className={styles.question}>
                <header>
                  <h4>Question {qIndex + 1}</h4>
                  {questions.length > 1 && <Button size="sm" variant="danger" onClick={() => removeQuestion(qIndex)}>Remove</Button>}
                </header>
                <FormField label="Prompt" value={question.prompt} onChange={(event) => patchQuestion(qIndex, { prompt: event.target.value })} required minLength={3} maxLength={500} />
                <div className={styles.options}>
                  {question.options.map((option, oIndex) => (
                    <label key={oIndex} className={styles.option}>
                      <input type="radio" name={`answer-${qIndex}`} checked={question.answerIndex === oIndex} onChange={() => patchQuestion(qIndex, { answerIndex: oIndex })} aria-label={`Mark option ${oIndex + 1} correct`} />
                      <input type="text" value={option} onChange={(event) => setOption(qIndex, oIndex, event.target.value)} placeholder={`Option ${oIndex + 1}`} required maxLength={200} />
                      {question.options.length > 2 && <Button size="sm" variant="ghost" onClick={() => removeOption(qIndex, oIndex)}>×</Button>}
                    </label>
                  ))}
                </div>
                <div className={styles.actions}>
                  {question.options.length < 6 && <Button size="sm" variant="outline" onClick={() => addOption(qIndex)}>Add option</Button>}
                  <small>Select the radio next to the correct answer.</small>
                </div>
              </fieldset>
            ))}
          </div>

          <div className={styles.actions}>
            {questions.length < 50 && <Button size="sm" variant="outline" onClick={addQuestion}>Add question</Button>}
          </div>
          <label className={styles.check}><input type="checkbox" name="published" defaultChecked={values.published ?? false} /> Published</label>
          <div className={styles.actions}>
            <Button type="submit" variant="dark" disabled={quizzes.loading}>{editing ? 'Save changes' : 'Create quiz'}</Button>
            {editing && <Button variant="ghost" onClick={reset}>Cancel</Button>}
          </div>
        </form>
      </Panel>
    </>
  )
}
