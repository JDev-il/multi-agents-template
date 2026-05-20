# Multi-Agent Monorepo Template

A generic, reusable project scaffold for building full-stack applications
using Claude Code with Git Worktrees and structured agent coordination.

Designed to support simultaneous, isolated agent workflows across frontend
and backend - without agents interfering with each other.

---

> [!IMPORTANT]
> **New to this template? Start here - one command sets everything up:**
> ```bash
> node .scaffold/init.js
> ```
> The initializer prompts you for your project details, writes all config files,
> and sets up your worktree environment automatically.
> **Do not manually edit any `CLAUDE.md` config blocks before running this.**

---

## What This Is

This template gives you a two-prompt development workflow:

**Prompt 1 - Instantiate**
Point Claude Code at the root `CLAUDE.md`. Fill in the `@config` block.
The agent audits the config, resolves the stack, and establishes the
project foundation.

**Prompt 2+ - Execute**
Reference a specific agent file in your prompt. The agent loads its
full behavioral spec and executes the task in isolation.

```
Use agents/UI.md. Task: build the activity table component.
```

That's it. No repeated context, no bloated prompts.

---

## Repo Structure

```
{{PROJECT_ROOT}}/
├── CLAUDE.md                 ← global coordination rules (auto-loaded)
├── CONTRACTS.md              ← shared types and enums (single source of truth)
├── shared/
│   ├── types/                ← cross-boundary TypeScript interfaces
│   ├── enums/                ← shared enums
│   └── agents/
│       └── SECURITY.md       ← cross-cutting security audit agent
├── backend/
│   ├── CLAUDE.md             ← backend config gate (auto-loaded)
│   └── agents/
│       ├── API.md            ← endpoints, DTOs, request/response shaping
│       ├── LOGIC.md          ← business rules, service layer
│       ├── AUTH.md           ← guards, strategies, token handling
│       ├── DB.md             ← schema, queries, migrations
│       ├── EVENTS.md         ← webhooks, Pub/Sub, message queues
│       ├── JOBS.md           ← background jobs, scheduled tasks
│       └── TESTING.md        ← backend test authoring
├── client/
│   ├── CLAUDE.md             ← client config gate (auto-loaded)
│   └── agents/
│       ├── UI.md             ← components, layout, styling
│       ├── LOGIC.md          ← state, API communication, guard impl
│       ├── FORMS.md          ← form architecture, validation, submission
│       ├── ROUTING.md        ← routes, guards wiring, lazy loading
│       ├── TESTING.md        ← client test authoring
│       └── ACCESSIBILITY.md  ← a11y audit and remediation
└── worktrees/                ← local only, never committed
```

---

## How It Works

### Context loads in waterfall order

```
root CLAUDE.md          → always auto-loaded (coordination law)
     ↓
<project>/CLAUDE.md     → auto-loaded per worktree (config gate)
     ↓
agents/<NAME>.md        → manually referenced per prompt (task spec)
```

### Agent isolation via Git Worktrees

Each agent operates on its own branch in its own worktree.
Agents never share a working directory.

```bash
# Create a worktree for a frontend UI task
git worktree add ../worktrees/client-ui -b agent/client/ui

# Create a worktree for a backend API task
git worktree add ../worktrees/backend-api -b agent/backend/api
```

Both agents run simultaneously without interfering with each other.

### CONTRACTS.md as the coordination seam

Types and enums shared across client and backend live only in
`CONTRACTS.md` and `shared/`. No agent writes to these unilaterally.
Changes go through an explicit proposal and human approval flow.

---

## Getting Started

### 1. Use this template

Click **"Use this template"** on GitHub to create your own repo from this scaffold.
Then clone it locally:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

---

> [!IMPORTANT]
> **Run the initializer before doing anything else.**
> It configures your project, fills in all `@config` blocks, and sets up the worktrees folder automatically.

### 2. Run the initializer

```bash
node .scaffold/init.js
```

The script will prompt you for:
- Project name
- Client framework and language
- Optional UI library, state management, and styling
- Backend framework and language (leave blank to decide later)

It writes all confirmed values directly into the correct `@config` lines across all `CLAUDE.md` files. **No manual file editing needed.**

### 3. Fill in Project Identity

In each `CLAUDE.md`, replace the `<!-- @annotation -->` blocks with a
brief description of your project. This gives agents the context they
need to understand what they're building.

### 4. Create your first worktree

```bash
git worktree add worktrees/client-ui -b agent/client/ui
```

Then open Claude Code inside the created worktree folder.

### 5. Run your first task

```
Use agents/UI.md. Task: scaffold the initial project structure.
```

---

## Agent Quick Reference

### Client agents

| Agent | Owns |
|-------|------|
| `UI.md` | Components, layout, styling, UX patterns |
| `LOGIC.md` | State, API communication, guard implementation |
| `FORMS.md` | Form architecture, validation, submission |
| `ROUTING.md` | Route definitions, guard wiring, lazy loading |
| `TESTING.md` | Component and flow test authoring |
| `ACCESSIBILITY.md` | a11y audit and remediation |

### Backend agents

| Agent | Owns |
|-------|------|
| `API.md` | Endpoints, DTOs, request/response shaping |
| `LOGIC.md` | Business rules, service layer, orchestration |
| `AUTH.md` | Strategies, guards, token handling |
| `DB.md` | Schema, repositories, migrations |
| `EVENTS.md` | Webhooks, Pub/Sub, message queues |
| `JOBS.md` | Background jobs, scheduled tasks |
| `TESTING.md` | Service, endpoint, and integration test authoring |

### Shared agents

| Agent | Owns |
|-------|------|
| `SECURITY.md` | Cross-cutting security audit and remediation proposals |

---

## Key Rules

1. **Agents write only within their domain** - a backend agent never
   touches `client/`, and vice versa.

2. **CONTRACTS.md is read-only for agents** - changes require a proposal
   and explicit human approval.

3. **One branch per agent** - never reuse a worktree branch across
   different agents or tasks.

4. **Config audit runs first** - no agent writes any code until the
   `@config` block in the project `CLAUDE.md` is complete.

5. **Prompts stay thin** - the agent file carries all behavioral detail.
   Your prompt provides the task only.

---

## Using This Template With an Existing Project

> [!IMPORTANT]
> **The template is a coordination layer, not a folder structure requirement.**
> The `.md` files are what matter. Folder names are just defaults - rename them to match your project.

---

### Scenario 1 - Existing Monorepo (frontend + backend in one repo)

**This is the easiest case.**

Map your existing folders to the template's naming convention, then drop in the `.md` files at the correct levels.

```
your-existing-repo/
├── your-frontend-folder/   →   rename or map to client/
├── your-backend-folder/    →   rename or map to backend/
```

1. Copy `CLAUDE.md` to the repo root
2. Copy `CONTRACTS.md` to the repo root
3. Copy `client/CLAUDE.md` into your frontend folder
4. Copy `backend/CLAUDE.md` into your backend folder
5. Copy the relevant `agents/` folders into each
6. Fill in the `@config` blocks

> [!NOTE]
> You don't have to rename your folders. Just update the paths in the root `CLAUDE.md` repo tree to reflect your actual folder names.

---

### Scenario 2 - Single Domain Repo (frontend only or backend only)

**Only copy what applies.**

If you have a frontend-only repo:
- Add root `CLAUDE.md` and `CONTRACTS.md`
- Add `client/CLAUDE.md` (or drop it at your src root)
- Add the `client/agents/` folder

If you have a backend-only repo:
- Add root `CLAUDE.md` and `CONTRACTS.md`
- Add `backend/CLAUDE.md`
- Add the `backend/agents/` folder

Skip everything else. The template is modular — unused scopes don't need to exist.

---

### Scenario 3 - Two Separate Repos (frontend + backend split)

**This is the most complex case. You have two options:**

<table>
<tr>
<th width="50%">Option A - Merge into a monorepo</th>
<th width="50%">Option B - Apply partially to each repo</th>
</tr>
<tr>
<td>

Create a new repo, move both projects into it as subfolders, apply the full template structure.

**Pros:** Full worktree parallelism, shared `CONTRACTS.md`, complete agent coordination.

**Cons:** Disruptive migration, requires team alignment.

</td>
<td>

Apply the template independently to each repo. Each gets its own root `CLAUDE.md` and agent files.

**Pros:** Zero migration effort, works immediately.

**Cons:** No shared `CONTRACTS.md` seam, no cross-repo worktree parallelism. Agents coordinate manually.

</td>
</tr>
</table>

> [!TIP]
> **Recommendation:** If you control both repos and are starting fresh work, merge into a monorepo. If you have an established codebase with existing CI/CD and team workflows, apply partially and migrate later.

---

### What Always Goes in Every Case

Regardless of your existing structure, these three things are always required:

| File | Where | Why |
|------|-------|-----|
| Root `CLAUDE.md` | Repo root | Global coordination law, auto-loaded by Claude Code |
| `CONTRACTS.md` | Repo root | Shared types seam - even if empty at first |
| At least one `<scope>/CLAUDE.md` | Your project folder | Config gate for that domain's agents |


---

## Extending This Template

**Adding a new agent:**
Create a new `.md` file in the relevant `agents/` folder using the
standard template structure:
`Mission → Pre-flight Checks → Operating Principles → Workflow →
Safety Rules → Communication → Definition of Done`

**Adding a new project scope:**
Duplicate the `client/` or `backend/` folder structure, rename it,
and add it to the root `CLAUDE.md` repo tree.

**Adding project-specific agents:**
Create them alongside the generic agents in the relevant `agents/`
folder. Use the same template. Fill in fully - no annotation markers
needed for project-specific files.

<!-- @annotation
  Add project-specific setup steps, environment variable list,
  deployment notes, or contributor guidelines below this line.
-->