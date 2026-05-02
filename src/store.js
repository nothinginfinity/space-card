import { create } from 'zustand'

const SEED_CARDS = [
  { id: 'alice', name: 'Alice', role: 'Frontend', icon: '🎨', column: 'inprogress', unread: 2, lastMsg: 'Pushed collapsible sidebar drawer changes', threads: [
    { id: 'alice-t1', title: 'sidebar drawer PR', status: 'open' },
    { id: 'alice-t2', title: 'token CSS refactor', status: 'open' },
  ]},
  { id: 'bob', name: 'Bob', role: 'DevOps', icon: '⚙️', column: 'inbox', unread: 4, lastMsg: 'CI pipeline still failing — investigating deploy-pages lock', threads: [
    { id: 'bob-t1', title: 'fix CI deploy-pages lock', status: 'open' },
    { id: 'bob-t2', title: 'package-lock.json', status: 'done' },
  ]},
  { id: 'owner', name: 'You', role: 'Owner', icon: '✦', column: 'inprogress', unread: 0, lastMsg: 'Speccing space-card repo', threads: [
    { id: 'owner-t1', title: 'space-card spec', status: 'open' },
    { id: 'owner-t2', title: 'MMCP workflow', status: 'done' },
  ]},
]

export const useStore = create((set, get) => ({
  cards: SEED_CARDS,
  activeSheet: null,    // card id with action sheet open
  expandedCards: {},    // { [cardId]: bool }

  moveCard: (id, column) => set(s => ({
    cards: s.cards.map(c => c.id === id ? { ...c, column } : c)
  })),

  openSheet: (id) => set({ activeSheet: id }),
  closeSheet: () => set({ activeSheet: null }),

  toggleExpand: (id) => set(s => ({
    expandedCards: { ...s.expandedCards, [id]: !s.expandedCards[id] }
  })),
}))
