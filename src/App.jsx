import { useState } from 'react'
import { Board } from './board/Board.jsx'
import { ActionSheet } from './actions/ActionSheet.jsx'
import { useStore } from './store.js'
import './App.css'

export function App() {
  const activeSheet = useStore(s => s.activeSheet)
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
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
        <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <Board />
      {activeSheet && <ActionSheet />}
    </div>
  )
}
