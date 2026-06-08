# Multi-Agent Monorepo Template

A scaffolding framework for building full-stack applications using multiple
Claude Code agents working simultaneously in isolated git worktrees — each
agent owning a specific domain, all coordinating through shared state.

---

## How It Works

Three commands drive the entire workflow:

```bash
npm run init      # one-time project setup
npm run launch    # create a new agent workspace
npm run complete  # merge finished work, start next task
```

No manual worktree management. No manual branch creation. No repeated context.

---

## Quickstart

```bash
git clone https://github.com/JDev-il/multi-agents-template.git my-project
cd my-project
npm run init
```

`npm run init` will:
- Ask for your project name, stack, and IDE preference
- Fetch all templates and workflow scripts from multi-agents-core
- Generate `BUILD_STATE.md`, `CONTRACTS.md`, `CLAUDE.md`
- Initialize agent tracking (`.scaffold/.tracking.json`)
- Set up git remote handling (see [Remote Setup](#remote-setup))

---

## Workflow

### 1. Launch a task

```bash
npm run launch
```

Select scope → agent → describe the task (or press Enter for default) →
workspace opens in your IDE automatically.

The agent reads `TASK.md` and executes autonomously.

### 2. Agent completes the task

The agent commits its work and runs `npm run complete` autonomously.
This merges the branch into main, updates `BUILD_STATE.md`, and clears
the tracking slot.

### 3. Repeat

`npm run complete` chains back to `npm run launch`. Pick the next agent
and continue building.

---

## Agent Roster

### Client

| Agent | Default task | Requires |
|-------|-------------|---------|
| `UI` | Scaffolds full project structure | — |
| `LOGIC` | State management, API integration, hooks | UI ✓ |
| `FORMS` | Form components, validation, submission | UI ✓ |
| `ROUTING` | Page routing, navigation, URL structure | UI ✓ |
| `TESTING` | Unit and integration tests | UI ✓ |
| `ACCESSIBILITY` | a11y compliance, keyboard navigation | UI ✓ |

### Backend (separate only)

| Agent | Default task | Requires |
|-------|-------------|---------|
| `API` | REST/GraphQL endpoints — start here | — |
| `LOGIC` | Business logic, services, data processing | API ✓ |
| `AUTH` | Authentication, authorization, sessions | API ✓ |
| `DB` | Database schemas, migrations, queries | — |
| `EVENTS` | Event queues, pub/sub, webhooks | API ✓ |
| `JOBS` | Background jobs, scheduled tasks | API ✓ |
| `TESTING` | API and integration tests | API ✓ |

### Shared

| Agent | Default task |
|-------|-------------|
| `SECURITY` | Shared auth utilities, encryption, validation |

> **Start with UI (client) or API (backend).** The launcher recommends
> the correct next agent dynamically based on what's already completed.

---

## Running the App

After agents complete their tasks and merge into main, the app lives
in `client/` (and `backend/` if configured separately):

```bash
cd client
npm install
npm run dev
```

For deployment (Vercel, Netlify etc.) set the **root directory** to
`client/` — not the repo root.

---

## Remote Setup

`npm run init` does NOT configure a GitHub remote. It removes the template
origin and leaves your project local-only.

**Your first agent session handles remote setup automatically:**

1. Checks SSH, gh CLI, and HTTPS credentials in order
2. If a remote is reachable — uses it
3. If not — opens your browser to `github.com/new` with the repo name
   pre-filled, waits for you to create it, then wires everything up

No manual `git remote add` needed.

---

## Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Global coordination rules — every agent reads this first |
| `BUILD_STATE.md` | Living project state — what's built, what's next |
| `CONTRACTS.md` | Shared types and interfaces — single source of truth |
| `TASK.md` | Per-task instructions — lives in the agent's worktree |
| `.scaffold/.config.json` | Project config written at init time |
| `.scaffold/.tracking.json` | Active agent state — managed by workflow scripts |

> **Never edit `BUILD_STATE.md` directly.** `npm run complete` owns all
> updates to it. Editing it in a worktree causes merge conflicts.

---

## CLAUDE.md Waterfall

Context loads in this order for every agent:

```
Root CLAUDE.md          ← global rules, protocols, tracking schema
        ↓
client/CLAUDE.md        ← stack config, client-specific rules
        ↓
agents/UI.md            ← agent-specific behavior and constraints
        ↓
TASK.md                 ← the specific task to execute
```

Each layer narrows scope. Agents never need to be told what framework
or language to use — it's resolved from config automatically.

---

## Guard System

The launcher enforces structural rules before any worktree is created:

- **Skeleton guard** — LOGIC/FORMS/ROUTING/TESTING require UI completed first
- **Prerequisite check** — surfaces unmet dependencies, lets you proceed or repick
- **Active agent gate** — if the same agent is already running, offers Continue / Complete / Abandon / Pick again
- **MISSING gate** — if a worktree was deleted without completing, mandatory Recover or Reset decision
- **Coexistence check** — if recovering, surfaces file conflicts and divergence before restoring

---

## Tracking

`.scaffold/.tracking.json` is the runtime state ledger. Every agent slot
is pre-defined at init time:

```json
{
  "client": {
    "UI": {
      "branch": "agent/client/ui/1780403456467",
      "status": "ACTIVE",
      "launchedAt": "2026-06-04T10:21:00Z",
      "missingCount": 0,
      "worktreePath": "/path/to/worktrees/..."
    }
  }
}
```

**Status values:** `null` (never launched) · `ACTIVE` (running) · `MISSING` (worktree deleted without completing)

Managed entirely by `launch.js` and `complete.js`. Never edit manually.

---

## Running Commands From Anywhere

`npm run launch` and `npm run complete` self-relocate to the repo root
via `git rev-parse --git-common-dir`. Run them from the worktree terminal,
the repo root, or anywhere inside the git tree — they always work.

---

## Cloning vs Use as Template

Both entry points work:

**`git clone`** (quickstart, no GitHub account needed upfront)
```bash
git clone https://github.com/JDev-il/multi-agents-template.git my-project
cd my-project
npm run init
```
The template remote is automatically removed. Remote setup happens on first agent session.

**Use as Template** (recommended for production projects)
Click "Use this template" on GitHub to create a repo under your own account
with a clean history. Then clone your new repo and run `npm run init`.

---

## Architecture

```
my-project/
├── client/               ← built by client agents, merges into main
│   ├── package.json
│   └── src/
├── backend/              ← built by backend agents (if separate)
├── shared/               ← shared agent files
├── worktrees/            ← local only, gitignored
│   └── client-my-project-ui-1780403456467/   ← isolated agent workspace
├── CLAUDE.md
├── BUILD_STATE.md
├── CONTRACTS.md
├── .scaffold/
│   ├── .config.json
│   ├── .tracking.json
│   └── .initialized
└── .workflow/
    ├── launch.js
    ├── complete.js
    └── guards.js
```

Each agent works in its own `worktrees/` folder on a dedicated branch.
On completion, its work merges into `main`. The final `main` branch is
a complete, runnable application.