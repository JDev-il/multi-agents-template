# Multi Agents

Multi-agent workflow orchestration for Claude Code — isolated git worktrees, structured state tracking, autonomous task chaining.

---

## Install

```bash
npm install -g multi-agents-cli
```

---

## Quickstart

```bash
multi-agents init my-project
cd my-project
npm run agent
```

`multi-agents init` will:
- Guide you through project name, stack, IDE, and build trajectory using arrow-key selection
- Fetch all templates and workflow scripts from multi-agents-core
- Generate `BUILD_STATE.md`, `CONTRACTS.md`, `CLAUDE.md`
- Generate `.scaffold/.paths.json` with expected framework paths
- Initialize agent tracking (`.scaffold/.tracking.json`)
- Install `prompts` dependency for arrow-key navigation
- Set up git remote handling (first agent session handles this automatically)

---

## Workflow

### 1. Launch a task

```bash
npm run agent
```

Select scope → agent → describe the task (or press Enter for default) →
workspace opens in your IDE automatically.

The agent reads `TASK.md` and executes autonomously.

### 2. Agent completes the task

The agent commits its work and runs `npm run complete` autonomously.
This merges the branch into main, updates `BUILD_STATE.md`, and clears
the tracking slot.

### 3. Repeat

`npm run complete` chains back to `npm run agent`. Pick the next agent
and continue building.

---

## Build Trajectories

Choose during `multi-agents init`:

**Multi-Agent Driven Orchestration** *(recommended)*
Every task should start with `npm run agent`. Each agent works in its own
git worktree — an isolated branch and folder that merges back into main via
`npm run complete`. Faster builds and lower token spend than a single long session.
⚠ If you commit directly to main yourself, you bypass the framework and break
task tracking for any active agent branches.

**Shared Orchestration**
You and agents co-build — each owning a defined part of the codebase. Agent
tasks run in git worktrees; your work happens directly in the project. Define
boundaries before work begins.
⚠ If you and an agent touch the same file, expect merge conflicts.

---

## Supported Frameworks

### Client
Next.js · Angular · Vue/Nuxt · SvelteKit · Vite+React · Remix

### Backend (separate)
Express · NestJS · Fastify · FastAPI · Django

Each framework has a dedicated scaffold instruction file in
`client/frameworks/` and `backend/frameworks/` — agents read these
before scaffolding to ensure files land in the correct location.

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

After agents complete their tasks and merge into main:

```bash
cd client
npm install
npm run dev
```

For deployment (Vercel, Netlify etc.) set the **root directory** to
`client/` — not the repo root.

---

## Remote Setup

`multi-agents init` does NOT configure a GitHub remote. Your first agent
session handles remote setup automatically:

1. Checks SSH, gh CLI, and HTTPS credentials in order
2. If a remote repo exists — evaluates its state (orphaned branches, completion status, age)
3. Auto-clears old sessions or surfaces a decision when unfinished work is detected
4. If no remote — opens your browser to `github.com/new` with the repo name pre-filled

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
| `.scaffold/.paths.json` | Expected and actual framework paths — updated by agents after scaffolding |

> **Never edit `BUILD_STATE.md` directly.** `npm run complete` owns all
> updates to it. Editing it in a worktree causes merge conflicts.

---

## CLAUDE.md Waterfall

Context loads in this order for every agent:

```
Root CLAUDE.md             ← global rules, protocols, tracking schema
        ↓
client/CLAUDE.md           ← stack config, framework scaffold instructions
        ↓
client/frameworks/{fw}.md  ← exact scaffold commands and path conventions
        ↓
agents/UI.md               ← agent-specific behavior and constraints
        ↓
TASK.md                    ← the specific task to execute
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

`.scaffold/.tracking.json` is the runtime state ledger:

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

Managed entirely by `agent.js` and `complete.js`. Never edit manually.

---

## Path Tracking

`.scaffold/.paths.json` maps expected and actual framework paths:

```json
{
  "client": {
    "typesDir": {
      "expected": "client/src/types",
      "current": null,
      "status": "pending"
    }
  }
}
```

**Status values:** `pending` (not yet scaffolded) · `verified` (agent confirmed path) · `diverged` (actual path differs from expected)

Written at init time. Updated by agents after scaffolding their framework.

---

## Running Commands From Anywhere

`npm run agent` and `npm run complete` self-relocate to the repo root
via `git rev-parse --git-common-dir`. Run them from the worktree terminal,
the repo root, or anywhere inside the git tree — they always work.

---

## Architecture

```
my-project/
├── client/                    ← built by client agents, merges into main
│   ├── frameworks/            ← scaffold instruction files per framework
│   └── src/
├── backend/                   ← built by backend agents (if separate)
│   └── frameworks/            ← scaffold instruction files per framework
├── shared/
├── worktrees/                 ← local only, gitignored
│   └── client-my-project-ui-1780403456467/
├── CLAUDE.md
├── BUILD_STATE.md
├── CONTRACTS.md
├── .scaffold/
│   ├── .config.json
│   ├── .tracking.json
│   ├── .paths.json
│   └── .initialized
└── .workflow/
    ├── agent.js
    ├── complete.js
    └── guards.js
```

Each agent works in its own `worktrees/` folder on a dedicated branch.
On completion, its work merges into `main`. The final `main` branch is
a complete, runnable application.