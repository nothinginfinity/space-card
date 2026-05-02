/**
 * MMCLI command parser
 *
 * Supported commands:
 *
 *   status [repo]                              — get CI + PR status
 *   read <repo> <path>                         — read a file
 *   ls <repo> [path]                           — list directory
 *   commit <repo> <path> <message> <content…>  — write a file
 *   msg <from> <to> <subject> | <body>         — send MMCP envelope
 *   say <from> <to> <body>                     — shorthand msg (subject auto-set)
 *   brainstorm <idea…>                         — capture idea (tags optional after --tags)
 *   help                                       — show command list
 *   clear                                      — clear terminal
 */

export function parseCommand(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const [cmd, ...rest] = trimmed.split(/\s+/)
  const lower = cmd.toLowerCase()

  switch (lower) {
    case 'help':
      return { type: 'help' }

    case 'clear':
      return { type: 'clear' }

    case 'status': {
      const repo = rest[0] || 'studio-spaces'
      return { type: 'status', repo }
    }

    case 'read': {
      const [repo, ...pathParts] = rest
      if (!repo || pathParts.length === 0)
        return { type: 'error', message: 'Usage: read <repo> <path>' }
      return { type: 'read', repo, path: pathParts.join(' ') }
    }

    case 'ls': {
      const [repo, ...pathParts] = rest
      if (!repo)
        return { type: 'error', message: 'Usage: ls <repo> [path]' }
      return { type: 'ls', repo, path: pathParts.join(' ') || '' }
    }

    case 'commit': {
      // commit <repo> <path> <message> <content…>
      const [repo, path, message, ...contentParts] = rest
      if (!repo || !path || !message || contentParts.length === 0)
        return { type: 'error', message: 'Usage: commit <repo> <path> <message> <content…>' }
      return { type: 'commit', repo, path, message, content: contentParts.join(' ') }
    }

    case 'msg': {
      // msg <from> <to> <subject> | <body…>
      const pipeIdx = rest.indexOf('|')
      if (pipeIdx === -1)
        return { type: 'error', message: 'Usage: msg <from> <to> <subject> | <body>' }
      const [from, to, ...subjectParts] = rest.slice(0, pipeIdx)
      const body = rest.slice(pipeIdx + 1).join(' ')
      if (!from || !to)
        return { type: 'error', message: 'Usage: msg <from> <to> <subject> | <body>' }
      return { type: 'msg', from, to, subject: subjectParts.join(' ') || '(no subject)', body }
    }

    case 'say': {
      // say <from> <to> <body…>
      const [from, to, ...bodyParts] = rest
      if (!from || !to || bodyParts.length === 0)
        return { type: 'error', message: 'Usage: say <from> <to> <message>' }
      const body = bodyParts.join(' ')
      return { type: 'msg', from, to, subject: body.slice(0, 60), body }
    }

    case 'brainstorm': {
      if (rest.length === 0)
        return { type: 'error', message: 'Usage: brainstorm <idea> [--tags tag1 tag2]' }
      const tagsIdx = rest.indexOf('--tags')
      const idea    = (tagsIdx === -1 ? rest : rest.slice(0, tagsIdx)).join(' ')
      const tags    = tagsIdx !== -1 ? rest.slice(tagsIdx + 1) : []
      return { type: 'brainstorm', idea, tags }
    }

    default:
      return { type: 'error', message: `Unknown command: ${cmd}. Type 'help' for commands.` }
  }
}
