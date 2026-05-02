import { useState, useCallback, useRef } from 'react'
import { mmcp } from './mmcpClient.js'
import { parseCommand } from './parseCommand.js'

const HELP_TEXT = `
MMCLI — Mobile Model Context Line Interface
────────────────────────────────────────────
status [repo]              CI + PR status
read <repo> <path>         Read a file
ls <repo> [path]           List directory
commit <repo> <path>       Write a file
  <message> <content…>
msg <from> <to>            Send MMCP envelope
  <subject> | <body>
say <from> <to> <body>     Quick message
brainstorm <idea>          Capture idea
  [--tags tag1 tag2]
clear                      Clear terminal
help                       This screen
────────────────────────────────────────────
Agents: alice · bob · owner
Repos:  studio-spaces · studio-brainstorm · space-card
`.trim()

export function useMMCLI() {
  const [lines, setLines] = useState([
    { type: 'system', text: 'MMCLI ready. Type help for commands.' },
  ])
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const [loading, setLoading] = useState(false)

  const push = useCallback((type, text) => {
    setLines(prev => [...prev, { type, text, ts: new Date().toLocaleTimeString() }])
  }, [])

  const run = useCallback(async (raw) => {
    const input = raw.trim()
    if (!input) return

    push('input', `$ ${input}`)
    setHistory(h => [input, ...h.slice(0, 49)])
    setHistIdx(-1)

    const cmd = parseCommand(input)
    if (!cmd) return

    if (cmd.type === 'clear') {
      setLines([{ type: 'system', text: 'MMCLI ready. Type help for commands.' }])
      return
    }

    if (cmd.type === 'help') {
      push('output', HELP_TEXT)
      return
    }

    if (cmd.type === 'error') {
      push('error', cmd.message)
      return
    }

    setLoading(true)
    try {
      let result
      switch (cmd.type) {
        case 'status':
          result = await mmcp.status(cmd.repo)
          push('output', formatStatus(result))
          break
        case 'read':
          result = await mmcp.read(cmd.repo, cmd.path)
          push('output', `── ${result.path}\n${result.content}`)
          break
        case 'ls':
          result = await mmcp.ls(cmd.repo, cmd.path)
          push('output', result.map(f => `${f.type === 'dir' ? '📁' : '📄'} ${f.name}`).join('\n'))
          break
        case 'commit':
          result = await mmcp.commit(cmd.repo, cmd.path, cmd.content, cmd.message)
          push('output', `✓ committed ${result.path} (${result.commit})`)
          break
        case 'msg':
          result = await mmcp.msg(cmd.from, cmd.to, cmd.subject, cmd.body)
          push('output', `✓ message sent to ${cmd.to}/inbox`)
          break
        case 'brainstorm':
          result = await mmcp.brainstorm(cmd.idea, cmd.tags)
          push('output', `✓ idea captured to studio-brainstorm`)
          break
      }
    } catch (err) {
      push('error', err.message)
    } finally {
      setLoading(false)
    }
  }, [push])

  const navigate = useCallback((dir, currentInput) => {
    const next = histIdx + dir
    if (next < 0) { setHistIdx(-1); return '' }
    if (next >= history.length) return currentInput
    setHistIdx(next)
    return history[next]
  }, [history, histIdx])

  return { lines, loading, run, navigate }
}

function formatStatus(data) {
  const runs = data.runs?.map(r =>
    `  ${r.conclusion === 'success' ? '✓' : r.conclusion === 'failure' ? '✗' : '·'} ${r.name} (${r.status})`
  ).join('\n') || '  no runs'
  const prs = data.open_prs?.map(p => `  #${p.number} ${p.title}`).join('\n') || '  no open PRs'
  return `── ${data.repo}\nCI runs:\n${runs}\nOpen PRs:\n${prs}`
}
