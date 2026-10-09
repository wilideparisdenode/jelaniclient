import { useResource } from '../../hooks/useResource'
import { formatDate } from '../../lib/format'
import PageTitle from '../../components/dashboard/PageTitle'
import StateMessage from '../../components/common/StateMessage'
import styles from './student.module.css'

// Site-wide announcements plus those for courses the student is enrolled in.
export default function StudentAnnouncements() {
  const announcements = useResource('/student/announcements')
  return (
    <>
      <PageTitle title="Announcements" />
      <StateMessage loading={announcements.loading} error={announcements.error} empty={!announcements.loading && !announcements.error && !announcements.rows.length} emptyText="No announcements yet." />
      <div className={styles.list}>
        {announcements.rows.map((item) => (
          <article key={item.id} className={styles.item}>
            <h3>{item.title}</h3>
            <small>{item.course?.title ?? 'All students'} · {formatDate(item.created_at)}</small>
            <p className={styles.body}>{item.body}</p>
          </article>
        ))}
      </div>
    </>
  )
}
