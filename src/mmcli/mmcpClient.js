/**
 * MMCP API client
 * Reads MMCP_API_URL from import.meta.env.VITE_MMCP_API_URL
 * Falls back to a demo stub when the env var is not set.
 */

const BASE = import.meta.env.VITE_MMCP_API_URL || null

async function call(path, body, method = 'POST') {
  if (!BASE) throw new Error('MMCP_API_URL not configured. Set VITE_MMCP_API_URL in your .env file.')
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) throw new Error(`MMCP API ${res.status}: ${await res.text()}`)
  return res.json()
}

export const mmcp = {
  status: (repo = 'studio-spaces') =>
    call(`/mmcp/status?repo=${repo}`, null, 'GET'),

  read: (repo, path, owner) =>
    call('/mmcp/read', { repo, path, ...(owner ? { owner } : {}) }),

  commit: (repo, path, content, message) =>
    call('/mmcp/commit', { repo, path, content, message }),

  msg: (from, to, subject, body, repo) =>
    call('/mmcp/msg', { from, to, subject, body, ...(repo ? { repo } : {}) }),

  ls: (repo, path = '') =>
    call('/mmcp/ls', { repo, path }),

  brainstorm: (idea, tags = [], project = 'studio-spaces', space = 'mmcli') =>
    call('/mmcp/brainstorm', { idea, tags, project, space }),
}
