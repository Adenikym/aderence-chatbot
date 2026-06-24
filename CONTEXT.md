# CONTEXT.md — Adherence Chatbot

> This file is the **single source of shared language** for the `adherence-chatbot` project.
> It is consumed by the AI agent at the start of every session to decode domain jargon,
> and updated via `/grill-with-docs` sessions as the domain evolves.
> Three groups must speak this language: **the codebase**, **the developer**, and **the domain expert (clinical staff at IDI ART clinic)**.

---

## 1. Project Overview

A **WhatsApp-based Chatbot Intervention** built with Node.js + Firebase, delivered via the
WhatsApp Business API to **Youth Living with HIV (YLHIV)** aged roughly 15–24 years attending
the **IDI ART Clinic** at the University College Hospital (UCH), Ibadan, Nigeria.

The chatbot supports two primary outcomes:
1. **ART Adherence** — helping users take their antiretroviral medication consistently
2. **HIV Knowledge** — providing evidence-based information about HIV transmission, prevention, and treatment

This is **Phase 2** of a three-phase research study. The chatbot is developed using a
**participatory co-design approach**, where YLHIV themselves shape the final intervention.

---

## 2. Domain Glossary

Terms listed here are canonical. When in doubt, use these exact words in code, comments,
variable names, and conversations.

### People

| Term | Definition |
|---|---|
| **Participant** | A YLHIV enrolled in the research study who interacts with the chatbot. Always referred to as "Participant" in code and data — never "patient", "client", or "user" in the domain sense (though "user" is acceptable in purely technical contexts). |
| **Youth Living with HIV (YLHIV)** | The target population: people aged approximately 15–24 years who are HIV-positive and attending the IDI ART clinic. The chatbot's communication style must be appropriate for this age group. |
| **Research Team** | The principal and co-investigators and supervisors who develop, maintain, and evaluate the chatbot. They access backend analytics but do not interact with participants through the chatbot. |
| **Healthcare Worker** | Clinical staff at the IDI ART clinic who contributed to content design. Not involved in chatbot operation. |
| **Co-Design Participant** | A purposively selected subset of Participants (10–20 individuals) who interact with the MVP chatbot during Phase 2 co-design sessions and provide iterative feedback. |

### Clinical Domain

| Term | Definition |
|---|---|
| **ART (Antiretroviral Therapy)** | The standard daily medication regimen for HIV management. "ART" and "medication" are used interchangeably in code. The chatbot **never** uses "ART" or "antiretroviral" in messages delivered to Participants — only in internal logs and analytics. |
| **Adherence** | Taking ART medication every day, at the correct time, as prescribed. The chatbot measures and supports adherence. |
| **Daily Routine** | The privacy-neutral term used in all Participant-facing messages in place of "medication" or "ART". Example: "Did you complete your daily routine today?" |
| **Dose** | A single instance of taking ART. A **Taken Dose** is one where the Participant confirms adherence. A **Missed Dose** is one where the Participant reports non-adherence or does not respond. |
| **Adherence Rate** | The percentage of Taken Doses over a given period (daily, weekly, monthly). Calculated from Check-In Responses. |
| **Viral Load** | The amount of HIV in a person's blood. Not a variable tracked by the chatbot; mentioned only in Knowledge content. |
| **CD4 Count** | A measure of immune system health. Not tracked by the chatbot; mentioned only in Knowledge content. |
| **Inadvertent Disclosure** | Accidental revelation of a Participant's HIV status, e.g. if someone sees a chatbot message that mentions HIV or ART. A primary safety concern. All Participant-facing messages are designed to prevent this. |
| **CASE Adherence Index** | A validated adherence self-report instrument used in Phase 3. The chatbot's Check-In data provides a complementary, longitudinal measure alongside it. |

### Chatbot Domain

| Term | Definition |
|---|---|
| **Session** | A single continuous interaction between a Participant and the chatbot. A Session begins when a message is received and ends when the chatbot returns to `idle` state or no further response is expected. |
| **Flow** | A named, self-contained conversation path that handles one user intent. The four canonical Flows are: **Onboarding Flow**, **Check-In Flow**, **Knowledge Flow**, and **Reminder Flow**. |
| **State** | The current position of a Participant within the conversation system. Stored in Firestore per Participant. Canonical state values: `onboarding`, `idle`, `checkin_pending`, `knowledge`, `updating_reminder`. |
| **Step** | A sub-position within a State, used to track progress through a multi-turn Flow. Example: `ask_name`, `ask_reminder_time` within the `onboarding` State. |
| **Onboarding Flow** | The first-time setup Flow triggered when a new Participant messages the chatbot. Collects Preferred Name and Reminder Time. |
| **Check-In Flow** | The core daily adherence Flow. The chatbot asks whether the Participant completed their Daily Routine. Stores a Check-In Response. |
| **Knowledge Flow** | The HIV information flow. Provides evidence-based content across six topic areas via a menu-driven interface. |
| **Reminder Flow** | Automated, scheduled messages sent at the Participant's Reminder Time to prompt a Check-In. Managed by `node-cron` via `services/scheduler.js`. If the Participant is in `idle` State, the reminder starts the Check-In Flow directly. If the Participant is in any other State, a privacy-neutral Nudge Message is sent instead, preserving their current session. Reminders fire regardless of whether the Participant has already checked in that day. |
| **Nudge Message** | A soft, privacy-neutral reminder sent when the Participant is mid-flow at their Reminder Time. Does not change the Participant's State. Example: "Don't forget your daily routine today! 💙" |
| **Check-In Response** | The Participant's answer to the daily Check-In prompt. Canonical values: `yes` (Taken) or `no` (Missed). Stored as a Checkin document in Firestore. |
| **Preferred Name** | The name a Participant chooses to be called by the chatbot during Onboarding. Stored on the Participant Record. Never the Participant's real clinical name. |
| **Reminder Time** | The user-defined time at which the Participant wishes to receive a daily Check-In reminder. Stored on the Participant Record as a string (e.g. `"8am"`, `"2pm"`). |
| **Main Menu** | The default message shown when a Participant in `idle` state sends an unrecognised input. Presents the numbered options for available Flows. |
| **Knowledge Topic** | One of six subject areas in the Knowledge Flow: `what-is-hiv`, `transmission`, `prevention`, `art-treatment`, `living-with-hiv`, `myths-and-facts`. |
| **Privacy-Neutral Language** | Message wording that cannot reveal a Participant's HIV status if seen by a third party. All Participant-facing notifications use Privacy-Neutral Language. |

### Data Domain

| Term | Definition |
|---|---|
| **Participant Record** | The Firestore document in the `users` collection keyed by the Participant's WhatsApp phone number. Contains State, Step, Preferred Name, Reminder Time, and other profile data. |
| **Study ID** | A unique identifier assigned to each Participant for research analytics. Separates personally identifiable information from interaction data. Not yet implemented — phone number is the current identifier. |
| **Checkin Document** | A Firestore document in the `checkins` collection recording a single Check-In Response. Fields: `phone`, `response` (`yes`/`no`), `timestamp`. |
| **Interaction Log** | The aggregated record of all Checkin Documents for a Participant over time. Used to compute Adherence Rate. |
| **Adherence Metric** | A derived statistic computed from Interaction Logs: daily status, weekly rate, or monthly rate. |
| **Backend Analytics** | The research team's view of Adherence Metrics and engagement data. Not exposed to Participants. |

---

## 3. Technical Glossary

| Term | Definition |
|---|---|
| **Webhook** | The HTTPS endpoint (`POST /webhook`) through which the WhatsApp Business API delivers inbound messages to the server. |
| **Router** | `flows/router.js` — the top-level function that orchestrates the system. Dispatches `InboundMessage`s and `SystemEvent`s (e.g. `REMINDER_TRIGGERED`) to the correct Flow adapter based on the Participant's current State. |
| **InboundMessage** | The canonical domain object representing a message sent by a Participant to the system, containing `participantPhone`, `content`, and `type`. Normalizes Meta's raw webhook payloads into a safe, internal format. |
| **Flow Module** | One of `flows/onboarding.js`, `flows/checkin.js`, `flows/knowledge.js`. Each acts as an adapter fulfilling a standard interface by exporting `supportedStates`, `start()`, and `handle()`. This allows the Router to discover and delegate to them dynamically. |
| **WhatsApp Service** | `services/whatsapp.js` — the single function responsible for sending messages via the Graph API. All outbound messages route through here. |
| **DB Service** | `services/db.js` — the Firebase/Firestore interface. Exports `getUser`, `updateUser`, `logCheckin`. The authoritative source for Participant Records. |
| **Scheduler Service** | `services/scheduler.js` — manages `node-cron` jobs for the Reminder Flow. Exports `registerReminder(phone, timeStr)`, `cancelReminder(phone)`, `registerAllReminders()`. Cron jobs are reconstructed from Firestore on server boot. All jobs use the `Africa/Lagos` timezone. |
| **Rule-Based System** | The current chatbot architecture: predefined inputs trigger predefined responses. No LLM or NLP is involved in message routing. This is intentional for the MVP stage. |
| **Environment Variables** | `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID`, `VERIFY_TOKEN`, `FIREBASE_SERVICE_ACCOUNT`, `PORT`. All loaded from `.env` in development; set in the deployment environment in production. |
| **node-cron** | The scheduler library used for the Reminder Flow. Cron jobs are keyed to each Participant's Reminder Time. |
| **MVP (Minimum Viable Product)** | The current implementation phase: a functional but deliberately limited chatbot with four core features (Onboarding, Check-In, Knowledge, Reminder). Advanced features are deferred post-co-design. |

---

## 4. Entity Relationships

```
Participant (users/{phone})
  ├── has one State (e.g. "idle", "checkin_pending")
  ├── has one Step (sub-position within State, nullable)
  ├── has one Preferred Name
  ├── has one Reminder Time
  └── has many Checkin Documents (checkins/{auto-id})
           └── each has: phone, response (yes/no), timestamp

Session
  └── is handled by one Flow
        ├── Onboarding Flow  →  state: "onboarding"
        ├── Check-In Flow    →  state: "checkin_pending"
        ├── Knowledge Flow   →  state: "knowledge"
        └── Reminder Flow    →  state: "idle" (triggers check-in)

WhatsApp Business API
  └── delivers inbound messages → POST /webhook → Router → Flow Module
```

---

## 5. Architectural Decisions

See `docs/adr/` for full records. Key decisions in effect:

| Decision | Choice | Rationale |
|---|---|---|
| Conversation architecture | Rule-based (not LLM-driven) | Reliability, consistency, feasibility at MVP stage |
| Database | Firebase Firestore | Real-time, serverless, low ops overhead for pilot |
| Message delivery | WhatsApp Business API via Graph API | Meets participants where they are; high penetration in Nigeria |
| Identifier for Participant Records | WhatsApp phone number (temporary) | Simplest for MVP; Study ID to be introduced in Phase 3 |
| Privacy-neutral reminders | "Daily routine" language | Prevents inadvertent disclosure — a key safety requirement |
| State machine | Flat state + step model | Simple, inspectable; no framework overhead needed at this scale |
| Reminder scheduling | In-memory `node-cron`, reconstructed on boot | Simpler than Cloud Scheduler; sufficient for MVP scale (10–20 Participants). See [ADR-0001](docs/adr/0001-in-memory-cron-for-reminders.md). |

---

## 6. What Is NOT In Scope (MVP)

These are explicitly excluded from the current implementation:

- LLM/NLP-based natural language understanding
- Integration with hospital records (EMR/EHR)
- Gamification
- Real-time clinical decision support
- Study ID linkage (deferred to Phase 3)
- Multi-language support (English only for MVP)

---

## 7. Current Implementation Status

| Feature | Status |
|---|---|
| Onboarding Flow | ✅ Implemented |
| Check-In Flow | ✅ Implemented |
| Knowledge Flow | ✅ Implemented (6 topics, sub-menus) |
| Reminder Flow (cron scheduling) | 🟡 Designed, not yet implemented |
| Update Reminder Time (option 3 in Main Menu) | 🟡 Designed, not yet implemented |
| Analytics / Adherence Metrics | ⬜ Not implemented |
| Study ID / anonymisation layer | ⬜ Not implemented |
| Privacy-neutral message audit | ⬜ Partial (check-in uses "daily routine"; knowledge module uses HIV terminology) |

---

## 8. Glossary Quick Reference (for AI Agent)

When writing code or messages for this project:

- Say **Participant**, not "user", "patient", or "client" (in domain context)
- Say **Check-In**, not "medication log" or "adherence survey"
- Say **Daily Routine** in any Participant-facing text, never "ART" or "medication"
- Say **Flow**, not "conversation handler" or "module" (in domain discussions)
- Say **State**, not "conversation stage" or "current mode"
- Say **Checkin Document**, not "adherence record" or "check-in entry"
- Say **Preferred Name**, not "username" or "display name"
- Say **Reminder Time**, not "notification time" or "alert time"
- Say **Inadvertent Disclosure**, not "privacy leak" or "accidental reveal" (in clinical discussions)