import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import StateMessage from '../components/common/StateMessage'
import styles from './posts.module.css'

// Public news / posts authored by admins. Everyone can read.
export default function PostsPage() {
  const { data: posts, loading, error } = useFetch('/posts', { select: (b) => b.posts, initial: [] })

  return (
    <>
      <PageHeader title="News & posts" subtitle="Updates, guides and announcements from Jelani Consulting." />
      <Section>
        <StateMessage loading={loading} error={error} empty={!loading && !error && !posts.length} emptyText="No posts published yet." />
        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <Link to={`/posts/${post.id}`} aria-label={post.title}>
                {post.cover_image
                  ? <img className={styles.cover} src={post.cover_image} alt="" loading="lazy" />
                  : <div className={styles.cover} style={{ background: 'var(--surface)' }} />}
              </Link>
              <div className={styles.cardBody}>
                <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
                {post.excerpt && <p>{post.excerpt}</p>}
                <p className={styles.meta}>{post.author_name ?? 'Jelani Consulting'} · {formatDate(post.created_at)}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
