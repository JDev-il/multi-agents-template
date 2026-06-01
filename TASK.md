# TASK - agentic flow test

## Scope
Project : client
Agent   : UI
Branch  : agent/client/ui/1780316626976

## Execution Mode
AUTONOMOUS - Execute all subtasks without stopping for confirmation.
Only stop if a genuinely destructive action is detected (modifying or deleting existing files).
New file creation does not require confirmation.

## Task
Use agents/UI.md. Task: scaffold the app

## How to start
Open a NEW Claude Code chat window and type:

> Read TASK.md and execute the task.

Do NOT reuse a previous chat session for this task.

---

## When Complete
1. Commit your work to this branch:
   git add . && git commit -m "feat: <brief description of what was built>"

2. Mark status as COMPLETED above

3. Run complete.js (from anywhere — worktree terminal is fine):

```
npm run complete
```

This merges your work into main and updates BUILD_STATE.md.

---

## Definition of Done
- [ ] All planned components exist and render correctly
- [ ] No business logic inside components
- [ ] All values derive from design tokens
- [ ] Shared types consumed from CONTRACTS.md

---

## Status
- [x] NOT STARTED
- [x] IN PROGRESS
- [x] COMPLETED

## Notes

Scaffolded full Next.js App Router client structure manually (no CLI tools, per CLAUDE.md rules).
Stack: Next.js 15 + TypeScript + Styled Components v6 + shadcn/ui + Zustand.
SC SSR handled via ServerStyleSheet registry in Providers.tsx (required for App Router).
Design tokens live in src/styles/theme.ts — Tailwind CSS variables in globals.css stay in sync.
shadcn components.json configured; components added via `npx shadcn add <component>` going forward.
No business logic, no state, no routing — pure scaffold structure only.
