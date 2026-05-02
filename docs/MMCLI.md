# MMCLI — Mobile Model Context Line Interface

MMCLI is the command interface layer inside space-card that lets Alice, Bob, or the owner send messages, read/write files, and inspect CI status — directly from the kanban board — via the MMCP API.

## Architecture

```
space-card (UI)
  └── MMCLI panel
        │
        │  HTTP POST/GET
        ▼
  mmcp-api (Cloudflare Worker)
        │
        │  GitHub REST API
        ▼
  nothinginfinity/studio-spaces
  nothinginfinity/space-card
  nothinginfinity/studio-brainstorm
```

## Opening MMCLI

Three entry points:
1. **Header button** — opens as owner
2. **Long-press a SpaceCard** → action sheet → "Open MMCLI as Alice/Bob" — opens scoped to that agent
3. *(Phase 2)* Quick-press FAB on mobile

## Agent Context

When MMCLI opens as Alice, the quick-action chips and default `from:` field are pre-set to `alice`. Same for Bob. This means:
- Tapping `msg bob` pre-fills `say alice bob `
- The terminal header shows `MMCLI @alice`

## Commands

| Command | Description | Example |
|---|---|---|
| `status [repo]` | CI runs + open PRs | `status studio-spaces` |
| `read <repo> <path>` | Read a file | `read studio-spaces spaces/alice/inbox.md` |
| `ls <repo> [path]` | List directory | `ls studio-spaces spaces` |
| `commit <repo> <path> <msg> <content>` | Write a file | `commit studio-spaces notes.md "add note" Hello world` |
| `msg <from> <to> <subject> \| <body>` | Send MMCP envelope | `msg alice bob ready for review \| PR is up` |
| `say <from> <to> <body>` | Quick message (subject auto) | `say alice bob sidebar PR is merged` |
| `brainstorm <idea> [--tags t1 t2]` | Capture idea | `brainstorm kanban for spaces --tags ui ux` |
| `clear` | Clear terminal | |
| `help` | Command list | |

## Configuration

Set the MMCP API URL in `.env`:

```
VITE_MMCP_API_URL=https://mmcp-api.YOUR-SUBDOMAIN.workers.dev
```

Without this, commands will fail with a clear error message. The UI works fine without it — commands just can't reach the API.

## Related

- [mmcp-api](https://github.com/nothinginfinity/mmcp-api) — the Cloudflare Worker this panel talks to
- [WORKFLOW.md](https://github.com/nothinginfinity/studio-spaces/blob/main/spaces/WORKFLOW.md) — MMCP messaging protocol
