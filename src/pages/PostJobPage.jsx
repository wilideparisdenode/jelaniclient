import { useState } from 'react'
import { api, errorMessage } from '../lib/api'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import styles from './FormPage.module.css'

// Public employer form. Submissions are held for admin approval.
export default function PostJobPage() {
  const [state, setState] = useState({ busy: false, done: false, error: '' })

  const submit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = Object.fromEntries(new FormData(formElement))
    setState({ busy: true, done: false, error: '' })
    try {
      await api.post('/jobs', form)
      formElement.reset()
      setState({ busy: false, done: true, error: '' })
    } catch (error) {
      setState({ busy: false, done: false, error: errorMessage(error) })
    }
  }

  return (
    <>
      <PageHeader title="Post a job" subtitle="Hire motivated graduates from our programmes. Listings are reviewed before publishing." />
      <Section>
        <form className={styles.form} onSubmit={submit}>
          <FormField label="Job title" name="title" required minLength={3} maxLength={140} />
          <FormField label="Company" name="company" required minLength={2} maxLength={120} />
          <FormField label="Location" name="location" maxLength={120} placeholder="City or Remote" />
          <FormField label="Description" name="description" as="textarea" required minLength={20} maxLength={5000} />
          <FormField label="Contact name" name="contact_name" maxLength={100} />
          <FormField label="Application email" name="apply_email" type="email" required />
          {state.error && <p className={styles.error} role="alert">{state.error}</p>}
          {state.done && <p className={styles.ok} role="status">Thanks! Your job is pending review.</p>}
          <Button type="submit" size="lg" disabled={state.busy}>{state.busy ? 'Submitting…' : 'Submit job'}</Button>
        </form>
      </Section>
    </>
  )
}
