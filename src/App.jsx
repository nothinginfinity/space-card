import { useState } from 'react'
import { Board } from './board/Board.jsx'
import { ActionSheet } from './actions/ActionSheet.jsx'
import { MMCLI } from './mmcli/MMCLI.jsx'
import { useStore } from './store.js'
import './App.css'

export function App() {
  const activeSheet = useStore(s => s.activeSheet)
  const [mmcliOpen, setMmcliOpen] = useState(false)
  const [mmcliAgent, setMmcliAgent] = useState('owner')
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  function openMMCLI(agent = 'owner') {
    setMmcliAgent(agent)
    setMmcliOpen(true)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11" y="1" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="1" y="11" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11" y="11" width="8" height="3.5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="11" y="16.5" width="8" height="2.5" rx="1.25" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>Space Card</span>
        </div>
        <div className="app-header-actions">
          <button
            className="mmcli-trigger-btn"
            onClick={() => openMMCLI('owner')}
            aria-label="Open MMCLI terminal"
            title="MMCLI"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M4 6l3 2.5L4 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span>MMCLI</span>
          </button>
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <Board onOpenMMCLI={openMMCLI} />

      {activeSheet && <ActionSheet onOpenMMCLI={openMMCLI} />}
      {mmcliOpen && <MMCLI agent={mmcliAgent} onClose={() => setMmcliOpen(false)} />}
    </div>
  )
}
