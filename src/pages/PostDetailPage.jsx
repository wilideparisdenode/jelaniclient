import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, errorMessage } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { formatDate } from '../lib/format'
import Button from '../components/common/Button'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import StateMessage from '../components/common/StateMessage'
import styles from './posts.module.css'

// One published post plus its approved comments. Signed-in users can submit a comment,
// which is held for admin moderation before it appears publicly.
export default function PostDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { data, loading, error, reload } = useFetch(`/posts/${id}`, {
    select: (b) => ({ post: b.post, comments: b.comments }),
    initial: { post: null, comments: [] },
  })
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setFormError('')
    try {
      await api.post(`/posts/${id}/comments`, { body })
      setBody('')
      setPending(true)
      await reload()
    } catch (requestError) {
      setFormError(errorMessage(requestError))
    } finally {
      setBusy(false)
    }
  }

  if (loading || error || !data?.post) {
    return <Section><StateMessage loading={loading} error={error || (!data?.post && !loading && 'Post not found.')} /></Section>
  }
  const { post, comments } = data

  return (
    <>
      <PageHeader title={post.title} subtitle={`${post.author_name ?? 'Jelani Consulting'} · ${formatDate(post.created_at)}`} />
      <Section>
        <article className={styles.article}>
          {post.cover_image && <img className={styles.coverFull} src={post.cover_image} alt="" />}
          <div className={styles.prose}>{post.body}</div>
        </article>

        <div className={styles.comments}>
          <h2>Comments ({comments.length})</h2>
          <StateMessage empty={!comments.length} emptyText="No comments yet. Be the first to comment." />
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <strong>{comment.author}</strong>
              <small>{formatDate(comment.created_at)}</small>
              <p>{comment.body}</p>
            </div>
          ))}

          {isAuthenticated
            ? (
              <form className={styles.form} onSubmit={submit}>
                <label htmlFor="comment-body" className={styles.note}>Leave a comment</label>
                <textarea id="comment-body" value={body} onChange={(event) => setBody(event.target.value)} required minLength={2} maxLength={2000} placeholder="Share your thoughts…" />
                {formError && <p className={styles.error} role="alert">{formError}</p>}
                {pending && <p className={styles.ok} role="status">Thanks! Your comment is awaiting moderation.</p>}
                <div><Button type="submit" variant="dark" disabled={busy}>{busy ? 'Posting…' : 'Post comment'}</Button></div>
              </form>
            )
            : <p className={styles.note}>Please <Link to="/login">sign in</Link> to join the conversation. Comments are reviewed before publishing.</p>}
        </div>
      </Section>
    </>
  )
}
