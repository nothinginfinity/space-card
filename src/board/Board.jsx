import { useStore } from '../store.js'
import { Column } from './Column.jsx'
import './Board.css'

const COLUMNS = [
  { id: 'inbox',      label: 'Inbox',       color: 'var(--color-inbox)' },
  { id: 'inprogress', label: 'In Progress', color: 'var(--color-inprogress)' },
  { id: 'waiting',    label: 'Waiting',     color: 'var(--color-waiting)' },
  { id: 'done',       label: 'Done',        color: 'var(--color-done)' },
]

export function Board() {
  const cards = useStore(s => s.cards)

  return (
    <div className="board">
      {COLUMNS.map(col => (
        <Column
          key={col.id}
          column={col}
          cards={cards.filter(c => c.column === col.id)}
        />
      ))}
    </div>
  )
}
