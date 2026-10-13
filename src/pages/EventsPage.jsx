import { useFetch } from '../hooks/useFetch'
import { formatDate } from '../lib/format'
import PageHeader from '../components/common/PageHeader'
import Section from '../components/common/Section'
import StateMessage from '../components/common/StateMessage'
import styles from './events.module.css'

// Turn a stored video link into an embeddable player, a native video, or a plain link.
function mediaFor(url) {
  if (!url) return null
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)
  if (youtube) return { kind: 'iframe', src: `https://www.youtube.com/embed/${youtube[1]}` }
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  if (/\.mp4($|\?)/i.test(url)) return { kind: 'video', src: url }
  return { kind: 'link', src: url }
}

export default function EventsPage() {
  const { data: events, loading, error } = useFetch('/events', { select: (b) => b.items, initial: [] })

  return (
    <>
      <PageHeader title="Events" subtitle="Open days, workshops, graduations and media from the Jelani community." />
      <Section>
        <StateMessage loading={loading} error={error} empty={!loading && !error && !events.length} emptyText="No events to show right now. Check back soon." />
        <div className={styles.grid}>
          {events.map((event) => {
            const media = mediaFor(event.video_url)
            return (
              <article key={event.id} className={styles.card}>
                {event.cover_image && <img className={styles.cover} src={event.cover_image} alt="" loading="lazy" />}
                <div className={styles.body}>
                  <p className={styles.meta}>
                    {event.event_date && <span>{formatDate(event.event_date)}</span>}
                    {event.location && <span>{event.location}</span>}
                  </p>
                  <h2>{event.title}</h2>
                  <p className={styles.text}>{event.description}</p>
                  {media?.kind === 'iframe' && (
                    <div className={styles.embed}>
                      <iframe src={media.src} title={event.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                    </div>
                  )}
                  {media?.kind === 'video' && <video className={styles.video} src={media.src} controls preload="metadata" />}
                  {media?.kind === 'link' && <a className={styles.videoLink} href={media.src} target="_blank" rel="noreferrer">Watch the recording →</a>}
                </div>
              </article>
            )
          })}
        </div>
      </Section>
    </>
  )
}
