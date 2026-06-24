# PRD: Reminder Flow & Update Reminder Time

## Problem Statement

Participants set a Reminder Time during Onboarding, but the chatbot never sends a reminder. The Reminder Flow is listed in CONTEXT.md as a canonical Flow and referenced in the Main Menu, but has no implementation. Additionally, Main Menu option 3 ("Update reminder time") is visible to Participants but does nothing when selected. This means Participants who forget to check in receive no prompt — undermining the chatbot's primary purpose of supporting ART Adherence — and Participants who try to change their Reminder Time hit a dead end, eroding trust.

## Solution

Implement automated daily reminders using `node-cron` that fire at each Participant's chosen Reminder Time. When the reminder fires, the chatbot checks the Participant's current State: if `idle`, it starts the Check-In Flow directly; if the Participant is mid-conversation (any other State), it sends a soft, privacy-neutral Nudge Message without interrupting their session. Additionally, implement the "Update reminder time" feature so Participants can change their Reminder Time via Main Menu option 3.

## User Stories

1. As a Participant, I want to receive a daily reminder at the time I chose during Onboarding, so that I don't forget to complete my Daily Routine.
2. As a Participant in `idle` State when my reminder fires, I want to be taken directly into the Check-In Flow, so that I can log my Daily Routine with a single reply (yes/no).
3. As a Participant browsing the Knowledge Flow when my reminder fires, I want to receive a gentle nudge without losing my place in the Knowledge menu, so that my current session isn't disrupted.
4. As a Participant in the Onboarding Flow when my reminder fires, I want to receive a gentle nudge without my Onboarding being interrupted, so that I can finish setting up first.
5. As a Participant who has already completed my Check-In for the day, I want to still receive my daily reminder at the scheduled time, so that my routine stays consistent regardless of when I checked in.
6. As a Participant who does not respond to a reminder, I want no follow-up messages sent, so that the chatbot doesn't feel like surveillance.
7. As a Participant, I want all reminder messages to use Privacy-Neutral Language ("daily routine"), so that my HIV status is not disclosed if someone else sees my phone.
8. As a Participant, I want to update my Reminder Time by selecting option 3 from the Main Menu, so that I can adjust my schedule without re-doing Onboarding.
9. As a Participant updating my Reminder Time, I want to type a natural time like "8am" or "2:30pm" instead of picking from a fixed list, so that the interaction feels personal.
10. As a Participant who types an unrecognisable time format, I want the chatbot to re-prompt me with an example, so that I can correct my input.
11. As a Participant who just completed Onboarding, I want my reminder to be registered immediately, so that I don't have to wait for a server restart to get my first reminder.
12. As a Participant who just updated my Reminder Time, I want the old reminder to stop and the new one to start immediately, so that I don't receive reminders at the old time.
13. As a member of the Research Team, I want all reminders to survive a server restart, so that Participants continue receiving reminders after deployments.
14. As a member of the Research Team, I want all reminders to fire in Africa/Lagos timezone (WAT, UTC+1), so that "8am" always means 8am local time at the IDI ART Clinic in Ibadan.

## Implementation Decisions

- **Scheduling engine**: In-memory `node-cron` with all jobs reconstructed from Firestore on server boot. See ADR-0001 for the trade-off against Cloud Scheduler.
- **Timezone**: All cron jobs hardcode `timezone: 'Africa/Lagos'`. No per-Participant timezone tracking.
- **State-aware dispatch**: The cron callback reads the Participant's current State from Firestore before acting. `idle` → start Check-In Flow. Any other State → send a Nudge Message without changing State.
- **Nudge Message**: A new domain term. A soft, privacy-neutral message sent when the Participant is mid-flow: "Hey [Preferred Name], don't forget your daily routine today! 💙"
- **No skip-if-checked-in logic**: Reminders fire regardless of whether the Participant already checked in that day. Keeps implementation stateless and avoids timezone-sensitive date comparisons.
- **No follow-up on non-response**: If the Participant doesn't respond, nothing happens. No auto-logged Missed Dose.
- **Time parsing**: A pure `parseTime(input)` function handles free-text input (e.g., "8am", "2:30pm", "14:00"). Returns `{ hour, minute }` or `null`. Invalid input triggers a re-prompt.
- **Scheduler as a service, not a flow**: Lives in `services/scheduler.js` because it manages timers, not conversation turns. Exports `registerReminder(phone, timeStr)`, `cancelReminder(phone)`, `registerAllReminders()`.
- **New `updating_reminder` State**: A distinct State for the "update reminder time" interaction, keeping `idle` clean. Handled by a new `flows/settings.js` module that follows the standard `start()`/`handle()` pattern.
- **Onboarding validation**: The `ask_reminder_time` step in Onboarding will parse and validate input via `parseTime`, re-prompting on failure (currently accepts anything).
- **Boot-time registration**: `registerAllReminders()` is called after `app.listen()` in `index.js`.

## Testing Decisions

- Tests should verify **external behaviour** at the service boundary — what messages get sent, what State transitions occur, what cron jobs get created — not internal implementation details like variable names or call order.
- **`parseTime`**: Pure function, tested directly with no mocks. Cover common formats (`8am`, `2:30pm`, `14:00`, `12am`, `12pm`) and invalid inputs (`morning`, empty string, emoji).
- **`services/scheduler.js`**: Mock `node-cron`, `db`, `whatsapp`, and `checkin`. Test cron expression correctness, timezone setting, State-aware dispatch (idle vs. non-idle), and boot-time reconstruction.
- **`flows/settings.js`**: Mock `db`, `whatsapp`, `scheduler`. Test the `start()`/`handle()` conversation turns: prompt sent, valid time accepted, invalid time re-prompted.
- **Existing test pattern**: Test files live in `__tests__/` mirroring the source path. No prior test files exist yet in the repo, but the convention is established in `AGENTS.md`.

## Out of Scope

- Follow-up messages for non-response (may be added post co-design feedback)
- Auto-logging Missed Doses for non-response
- Per-Participant timezone configuration
- Multiple reminders per day
- Reminder frequency options (e.g., weekly instead of daily)
- LLM/NLP-based time parsing

## Further Notes

- The PRD was designed through a `/grill-with-docs` session that resolved 10 design decisions one by one.
- All new domain terms (Nudge Message, Scheduler Service, `updating_reminder` State) have been added to `CONTEXT.md`.
- The scheduling decision is recorded in `docs/adr/0001-in-memory-cron-for-reminders.md`.
