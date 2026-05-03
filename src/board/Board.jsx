import { useStore } from '../store.js'
import { Column } from './Column.jsx'
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core'
import './Board.css'

const COLUMNS = [
  { id: 'inbox',      label: 'Inbox',       color: 'var(--color-inbox)' },
  { id: 'inprogress', label: 'In Progress', color: 'var(--color-inprogress)' },
  { id: 'waiting',    label: 'Waiting',     color: 'var(--color-waiting)' },
  { id: 'done',       label: 'Done',        color: 'var(--color-done)' },
]

export function Board() {
  const cards = useStore(s => s.cards)
  const moveCard = useStore(s => s.moveCard)

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const cardId = active.id
    const targetColumnId = over.id
    const card = cards.find(c => c.id === cardId)

    if (card && card.column !== targetColumnId) {
      moveCard(cardId, targetColumnId)
    }
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            column={col}
            cards={cards.filter(c => c.column === col.id)}
          />
        ))}
      </div>
    </DndContext>
  )
}
