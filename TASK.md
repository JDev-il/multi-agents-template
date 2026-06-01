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
- [ ] NOT STARTED
- [ ] IN PROGRESS
- [ ] COMPLETED

## Notes
<!-- Agent writes completion notes, decisions, and open questions here -->
