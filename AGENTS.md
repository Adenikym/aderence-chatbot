# Agent Instructions — Adherence Chatbot

## Before every session
1. Read `CONTEXT.md` at the project root. Use the terminology defined there in all
   responses and code. Say "Participant" not "user". Say "Check-In" not "medication log".
   Say "Daily Routine" in any message that could be seen by a Participant.

## Coding conventions
- All flows export `start(from, user)` and `handle(from, text, user)` functions.
- All database access goes through `services/db.js`. Never call Firestore directly.
- All outbound messages go through `services/whatsapp.js`. Never call the Graph API directly.
- Privacy-Neutral Language is mandatory in any string that will be sent to a Participant.

## Testing
- Write a failing test before any implementation (red → green → refactor).
- Test files live in `__tests__/`. Mirror the source path (e.g. `flows/checkin.js` → `__tests__/flows/checkin.test.js`).

## Documentation
- When a non-obvious architectural decision is made, create an ADR in `docs/adr/`.
- When a new domain term is resolved, update `CONTEXT.md` Section 2 or 3.

## Agent skills

### Issue tracker

GitHub Issues on this repo (`Adenikym/aderence-chatbot`). No PR triage. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
