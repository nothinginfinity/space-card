import { useHold } from './useHold.js'
import './Card.css'

export function ThreadCard({ thread }) {
  const holdHandlers = useHold(() => {
    // Phase 2: thread-level action sheet
    console.log('long-press thread:', thread.id)
  })

  return (
    <div className={`thread-card thread-card--${thread.status}`} {...holdHandlers}>
      <span className="thread-dot" />
      <span className="thread-title">{thread.title}</span>
      <span className="thread-status">{thread.status}</span>
    </div>
  )
}
