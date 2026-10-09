import { useState } from 'react'
import { api, errorMessage } from '../../lib/api'
import { useResource } from '../../hooks/useResource'
import Button from '../../components/common/Button'
import PageTitle from '../../components/dashboard/PageTitle'
import StateMessage from '../../components/common/StateMessage'
import styles from './student.module.css'

// One published quiz. Answer keys are stripped by the API; scoring happens server-side.
function QuizCard({ quiz }) {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const questions = quiz.questions ?? []
    if (questions.some((_, index) => answers[index] === undefined)) {
      setError('Please answer every question before submitting.')
      return
    }
    setBusy(true); setError('')
    try {
      const payload = questions.map((_, index) => Number(answers[index]))
      const { data } = await api.post(`/student/quizzes/${quiz.id}/submit`, { answers: payload })
      setResult(data)
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  const questions = quiz.questions ?? []

  return (
    <form className={styles.quiz} onSubmit={submit}>
      <header>
        <h3>{quiz.title}</h3>
        <small>{quiz.course?.title} · {questions.length} question{questions.length === 1 ? '' : 's'}</small>
      </header>

      {questions.map((question, qIndex) => (
        <fieldset key={qIndex} className={styles.question} disabled={Boolean(result)}>
          <p>{qIndex + 1}. {question.prompt}</p>
          <div className={styles.options}>
            {question.options.map((option, oIndex) => (
              <label key={oIndex} className={styles.option}>
                <input
                  type="radio"
                  name={`q-${quiz.id}-${qIndex}`}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => setAnswers((current) => ({ ...current, [qIndex]: oIndex }))}
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {error && <p className={styles.error} role="alert">{error}</p>}
      {result
        ? <p className={styles.result}>Score: {result.score} / {result.total}</p>
        : <div><Button type="submit" variant="dark" disabled={busy}>{busy ? 'Submitting…' : 'Submit answers'}</Button></div>}
    </form>
  )
}

export default function StudentQuizzes() {
  const quizzes = useResource('/student/quizzes')
  return (
    <>
      <PageTitle title="Quizzes" />
      <StateMessage loading={quizzes.loading} error={quizzes.error} empty={!quizzes.loading && !quizzes.error && !quizzes.rows.length} emptyText="No quizzes are available for your courses yet." />
      <div className={styles.list}>
        {quizzes.rows.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
      </div>
    </>
  )
}
