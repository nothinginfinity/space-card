import { useState, useRef, useEffect } from 'react'
import { useMMCLI } from './useMMCLI.js'
import './MMCLI.css'

export function MMCLI({ agent = 'owner', onClose }) {
  const { lines, loading, run, navigate } = useMMCLI()
  const [input, setInput] = useState('')
  const terminalRef = useRef(null)
  const inputRef    = useRef(null)

  // Auto-scroll to bottom on new lines
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Focus input on open
  useEffect(() => { inputRef.current?.focus() }, [])

  function handleSubmit(e) {
    e.preventDefault()
    run(input)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setInput(navigate(1, input))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setInput(navigate(-1, input))
    }
  }

  const QUICK = [
    { label: 'status', cmd: 'status studio-spaces' },
    { label: 'alice inbox', cmd: 'read studio-spaces spaces/alice/inbox.md' },
    { label: 'bob inbox',   cmd: 'read studio-spaces spaces/bob/inbox.md' },
    { label: 'msg alice',   cmd: `say ${agent} alice ` },
    { label: 'msg bob',     cmd: `say ${agent} bob ` },
    { label: 'ls spaces',   cmd: 'ls studio-spaces spaces' },
  ]

  return (
    <div className="mmcli" role="dialog" aria-modal="true" aria-label="MMCLI Terminal">
      <div className="mmcli-header">
        <div className="mmcli-title">
          <span className="mmcli-dot mmcli-dot--red" />
          <span className="mmcli-dot mmcli-dot--yellow" />
          <span className="mmcli-dot mmcli-dot--green" />
          <span className="mmcli-name">MMCLI <span className="mmcli-agent">@{agent}</span></span>
        </div>
        <button className="mmcli-close" onClick={onClose} aria-label="Close terminal">✕</button>
      </div>

      <div className="mmcli-quickbar">
        {QUICK.map(q => (
          <button
            key={q.label}
            className="mmcli-quick-btn"
            onClick={() => { setInput(q.cmd); inputRef.current?.focus() }}
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="mmcli-terminal" ref={terminalRef}>
        {lines.map((line, i) => (
          <div key={i} className={`mmcli-line mmcli-line--${line.type}`}>
            {line.type !== 'input' && line.ts && (
              <span className="mmcli-ts">{line.ts}</span>
            )}
            <pre className="mmcli-text">{line.text}</pre>
          </div>
        ))}
        {loading && (
          <div className="mmcli-line mmcli-line--loading">
            <span className="mmcli-spinner" aria-label="loading">⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏</span>
          </div>
        )}
      </div>

      <form className="mmcli-input-row" onSubmit={handleSubmit}>
        <span className="mmcli-prompt">$</span>
        <input
          ref={inputRef}
          className="mmcli-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`type a command… (help)`}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="MMCLI command input"
        />
        <button type="submit" className="mmcli-send" disabled={loading} aria-label="Run command">
          ↵
        </button>
      </form>
    </div>
  )
}
