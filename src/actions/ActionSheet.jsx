import { useStore } from '../store.js'
import './ActionSheet.css'

const COLUMNS = [
  { id: 'inbox',      label: '📥 Move to Inbox' },
  { id: 'inprogress', label: '▶️ Move to In Progress' },
  { id: 'waiting',    label: '⏳ Move to Waiting' },
  { id: 'done',       label: '✅ Move to Done' },
]

export function ActionSheet() {
  const { cards, activeSheet, closeSheet, moveCard } = useStore()
  const card = cards.find(c => c.id === activeSheet)
  if (!card) return null

  return (
    <>
      <div className="sheet-overlay" onClick={closeSheet} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={`Actions for ${card.name}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <span className="sheet-icon">{card.icon}</span>
          <div>
            <div className="sheet-name">{card.name}</div>
            <div className="sheet-role">{card.role}</div>
          </div>
        </div>
        <div className="sheet-actions">
          <button className="sheet-action" onClick={closeSheet}>
            <span>🔗</span> Open Space
          </button>
          <button className="sheet-action" onClick={closeSheet}>
            <span>📨</span> View Inbox {card.unread > 0 && <span className="sheet-badge">{card.unread}</span>}
          </button>
          <button className="sheet-action" onClick={closeSheet}>
            <span>📤</span> Send Message
          </button>
          <div className="sheet-divider" />
          {COLUMNS.filter(col => col.id !== card.column).map(col => (
            <button key={col.id} className="sheet-action" onClick={() => { moveCard(card.id, col.id); closeSheet() }}>
              {col.label}
            </button>
          ))}
          <div className="sheet-divider" />
          <button className="sheet-action sheet-action--danger" onClick={closeSheet}>
            <span>🗃️</span> Archive
          </button>
        </div>
      </div>
    </>
  )
}
