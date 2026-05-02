import { useStore } from '../store.js'
import { useHold } from './useHold.js'
import { ThreadCard } from './ThreadCard.jsx'
import './Card.css'

export function SpaceCard({ card }) {
  const { openSheet, expandedCards, toggleExpand } = useStore()
  const expanded = expandedCards[card.id]

  const holdHandlers = useHold(() => openSheet(card.id))

  return (
    <div className={`space-card ${expanded ? 'space-card--expanded' : ''}`}>
      <div className="space-card-main" {...holdHandlers}>
        <div className="space-card-top">
          <span className="space-card-icon">{card.icon}</span>
          <div className="space-card-meta">
            <span className="space-card-name">{card.name}</span>
            <span className="space-card-role">{card.role}</span>
          </div>
          {card.unread > 0 && (
            <span className="space-card-badge">{card.unread}</span>
          )}
        </div>
        <p className="space-card-preview">{card.lastMsg}</p>
        <div className="space-card-footer">
          <span className="space-card-threads">{card.threads.length} thread{card.threads.length !== 1 ? 's' : ''}</span>
          <button
            className="space-card-expand-btn"
            onClick={e => { e.stopPropagation(); toggleExpand(card.id) }}
            aria-label={expanded ? 'Collapse threads' : 'Expand threads'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-card-threads-list">
          {card.threads.map(t => (
            <ThreadCard key={t.id} thread={t} parentId={card.id} />
          ))}
        </div>
      )}
    </div>
  )
}
