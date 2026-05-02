# space-card

A kanban board UI for navigating connected Perplexity spaces — with long-press actions, MMCP inbox/outbox thread visibility, and infinite card nesting.

> **Status:** Spec / Phase 0 — UI prototype in progress.  
> **Parent project:** [studio-spaces](https://github.com/nothinginfinity/studio-spaces)

---

## What is this?

When you run multiple Perplexity Spaces in parallel — Alice on frontend, Bob on DevOps, you as the owner orchestrating — tracking what's in-flight becomes a mental load problem. A flat sidebar list doesn't show you *state*.

`space-card` is a standalone kanban board where **each card = one Perplexity Space**. Cards move across columns as work flows through the MMCP lifecycle. Long-pressing a card opens an action sheet for messaging, navigation, and thread inspection — without leaving the board.

---

## Core Concepts

### The Card

A `SpaceCard` represents one Perplexity Space. It displays:

- Space name + icon
- Agent role badge (e.g. Alice / Bob / Owner)
- Unread inbox count chip
- Last message preview (truncated to 1 line)
- Column status indicator
- Thread count (conversations open inside this Space)

### The Board

Four columns representing the MMCP workflow state:

| Column | Meaning | Card lives here when... |
|---|---|---|
| **Inbox** | Needs attention | Unread messages in inbox.md |
| **In Progress** | Actively working | Space has an open conversation |
| **Waiting** | Blocked / pending reply | Outbox has sent items, no response |
| **Done** | Complete | Thread resolved, no open items |

Cards are draggable between columns. On mobile, drag is replaced by long-press → Move action.

### Long-Press Action Sheet

Hold a card for 500ms to open a bottom sheet with contextual actions:

```
[ Open Space ]          → navigate into the Perplexity Space
[ View Inbox ]          → expand inbox.md messages inline
[ Send to Alice ]       → compose MMCP envelope to alice/inbox.md
[ Send to Bob ]         → compose MMCP envelope to bob/inbox.md
[ Move column → ]       → slide picker: Inbox / In Progress / Waiting / Done
[ Pin card ]            → float above column, always visible
[ Expand threads ]      → unfold sub-cards for each conversation thread
[ Archive ]             → remove from board without deleting
```

### Infinite Nesting (Thread Cards)

Expanding a SpaceCard reveals **thread sub-cards** — one per conversation inside that Space. Each thread card has its own long-press sheet and can be moved independently. This creates a two-level board:

```
Board
└── SpaceCard (Alice)
    ├── ThreadCard: "sidebar drawer PR"
    ├── ThreadCard: "token CSS refactor"
    └── ThreadCard: "empty state design"
```

Thread cards do not have their own inbox/outbox — they inherit from the parent Space.

---

## MMCP Integration

The board reads from and writes to the `spaces/` directory in the linked GitHub repo:

```
spaces/
  alice/
    inbox.md      ← Alice reads here
    outbox.md     ← Alice writes here
  bob/
    inbox.md
    outbox.md
  WORKFLOW.md
```

Inbox message count is parsed from `inbox.md` envelope headers (`--- from: ... ---`). Sending a message appends a new MMCP envelope to the recipient's inbox file via the GitHub API.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Matches studio-spaces |
| Drag-and-drop | `@dnd-kit/core` | Accessible, touch-friendly |
| Long-press | Custom hook (`useHold`) | 500ms threshold, cancel on move |
| State | Zustand | Already used in studio-spaces |
| GitHub API | `@octokit/rest` | Read inbox.md, append messages |
| Styling | CSS custom properties | Nexus design tokens from studio-spaces |
| Animations | CSS transitions + `clip-path` | No heavy lib needed for Phase 0 |

---

## Phases

### Phase 0 — Static Board Shell *(current)*
- [ ] Column layout (4 columns, responsive)
- [ ] SpaceCard component (static data)
- [ ] Long-press hook (`useHold`)
- [ ] Action sheet bottom drawer
- [ ] Dark/light mode toggle
- [ ] Design token system from studio-spaces

### Phase 1 — Drag + Move
- [ ] `@dnd-kit` drag between columns
- [ ] Mobile long-press → Move sheet
- [ ] Card position persisted in `localStorage`
- [ ] Pin / unpin card

### Phase 2 — Thread Expansion
- [ ] Expand/collapse thread sub-cards
- [ ] Thread card component
- [ ] Nested long-press sheet (thread-level actions)
- [ ] Scroll-into-parent on expand

### Phase 3 — MMCP Live Data
- [ ] GitHub API integration (read inbox.md)
- [ ] Parse MMCP envelope count → unread badge
- [ ] Compose + send envelope via GitHub API
- [ ] Inbox viewer panel (inline message list)
- [ ] Outbox log panel

### Phase 4 — Polish
- [ ] Card animations (slide in/out columns)
- [ ] Haptic feedback placeholders (mobile)
- [ ] Keyboard navigation (arrow keys move cards)
- [ ] Export board state as `.space` file

---

## File Structure (target)

```
space-card/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── tokens.css          ← Nexus design tokens
│   ├── base.css            ← Reset + base styles
│   ├── board/
│   │   ├── Board.jsx       ← 4-column layout
│   │   ├── Column.jsx      ← Column header + card list
│   │   ├── Board.css
│   │   └── useBoardState.js
│   ├── card/
│   │   ├── SpaceCard.jsx   ← Main card component
│   │   ├── ThreadCard.jsx  ← Sub-card (nested thread)
│   │   ├── Card.css
│   │   └── useHold.js      ← Long-press hook
│   ├── actions/
│   │   ├── ActionSheet.jsx ← Bottom drawer
│   │   ├── ActionSheet.css
│   │   └── actions.js      ← Action handlers
│   ├── mmcp/
│   │   ├── parseInbox.js   ← Parse inbox.md envelopes
│   │   ├── sendMessage.js  ← Append to inbox via GitHub API
│   │   └── envelope.js     ← MMCP format helpers
│   └── store.js            ← Zustand store
├── docs/
│   ├── SPEC.md             ← This document (extended)
│   ├── COMPONENTS.md       ← Component API reference
│   └── MMCP-BRIDGE.md      ← GitHub API integration guide
└── .github/
    └── workflows/
        └── deploy.yml      ← GitHub Pages deploy
```

---

## Design Principles

1. **Board is the home screen** — not a sidebar, not a list. The board is where you live.
2. **Long-press is the power user layer** — single tap opens, long press acts.
3. **Cards show state, not just name** — unread count, last message, column position all carry meaning.
4. **Infinite nesting is opt-in** — board starts flat. You expand into depth when you need it.
5. **MMCP-native** — the board is a visual layer on top of the GitHub-file messaging protocol. No new data format, no new backend.

---

## Related Repos

- [studio-spaces](https://github.com/nothinginfinity/studio-spaces) — the parent chat app this board navigates
- [Studio-OS-Chat](https://github.com/nothinginfinity/Studio-OS-Chat) — the owner's orchestration space

---

## Getting Started

```bash
git clone https://github.com/nothinginfinity/space-card
cd space-card
npm install
npm run dev
```

Opens at `http://localhost:5173`
