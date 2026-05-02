import { SpaceCard } from '../card/SpaceCard.jsx'
import './Column.css'

export function Column({ column, cards }) {
  return (
    <div className="column">
      <div className="column-header">
        <span className="column-dot" style={{ background: column.color }} />
        <span className="column-label">{column.label}</span>
        <span className="column-count">{cards.length}</span>
      </div>
      <div className="column-cards">
        {cards.map(card => <SpaceCard key={card.id} card={card} />)}
        {cards.length === 0 && (
          <div className="column-empty">No spaces here</div>
        )}
      </div>
    </div>
  )
}
