# BUILD_STATE.md
# Living project state. Read before every task. Update after completion.
# Every agent must read this file at session start.

## Project
Name      : NG Agentic Flow
Initialized : 2026-05-26T11:32:33.315Z

## Stack
Client  : Angular + TypeScript + SCSS / SASS + Angular Material + Signals (built-in)
Backend : Express + TypeScript + TypeORM + JWT-only

## Client State
- [ ] Scaffold - framework initialized
- [ ] UI - components and layout
- [ ] LOGIC - state management and API client
- [ ] FORMS - form architecture
- [ ] ROUTING - route definitions
- [ ] TESTING - test suite
- [ ] ACCESSIBILITY - a11y compliance

## Backend State
Type: Separate backend (Express)
- [ ] Scaffold - framework initialized
- [ ] DB - schema and entities
- [ ] API - endpoints and DTOs
- [ ] AUTH - authentication strategy
- [ ] LOGIC - business rules
- [ ] EVENTS - webhooks and queues
- [ ] JOBS - background tasks

## Shared
- [ ] CONTRACTS.md - no shared types defined yet

## Dependency Rules
Before starting any task, verify:
- Client LOGIC requires: Client scaffold done
- Client FORMS requires: Client scaffold done
- Client ROUTING requires: Client scaffold done
- API calls in client require: Backend API endpoints done OR mocked
- Backend API requires: DB schema done (if using DB)
- Backend AUTH requires: DB User entity done
- Any cross-boundary types: Must exist in CONTRACTS.md first

If a dependency is not met:
  DEPENDENCY NOT MET - surface what is missing and propose options.
  Never proceed silently on a missing dependency.

## Agent Log
| Date | Agent | Scope | Task | Status | Branch |
|------|-------|-------|------|--------|--------|
| 2026-05-26 | UI | client | Create the ui | COMPLETED | agent/client/ui/1779795164062 |
