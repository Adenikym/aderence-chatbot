# Adherence Chatbot

A WhatsApp-based Chatbot Intervention built with Node.js and Firebase, delivered via the WhatsApp Business API to Youth Living with HIV (YLHIV) aged 15–24 years attending the IDI ART Clinic at the University College Hospital (UCH), Ibadan, Nigeria.

This chatbot is designed to support two primary clinical outcomes:
1. **ART Adherence** — Helping Participants take their medication consistently using daily privacy-neutral "check-in" reminders.
2. **HIV Knowledge** — Providing an accessible menu of evidence-based information regarding HIV transmission, prevention, treatment, and lifestyle.

This project represents Phase 2 of a broader research study and is being developed using a participatory co-design approach where Participants directly shape the final intervention.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Contributing (Agentic Workflow)](#contributing-agentic-workflow)

---

## Prerequisites
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **Firebase Service Account**: You must have a valid Firebase service account JSON to interact with Firestore.
- **WhatsApp Business API**: You must have valid tokens to receive webhooks and send messages.

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Adenikym/aderence-chatbot.git
cd aderence-chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the project with the following keys:
```env
PORT=3000
WHATSAPP_TOKEN=your_whatsapp_graph_api_token
PHONE_NUMBER_ID=your_whatsapp_phone_number_id
VERIFY_TOKEN=your_custom_webhook_verify_token
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```
*(Note: Compress your Firebase JSON into a single string for the `.env` variable).*

### 4. Run the application
To start the application in development mode (with file watching):
```bash
npm run dev
```

To start the application for production:
```bash
npm start
```

The server will listen for WhatsApp webhooks at `POST /webhook` and verify subscriptions at `GET /webhook`.

---

## Testing

The project uses `jest` for testing, following a strict Test-Driven Development (TDD) methodology.

To run the test suite once:
```bash
npm test
```

To run the test suite in watch mode during development:
```bash
npm run test:watch
```

---

## Contributing (Agentic Workflow)

This project is actively developed and maintained using an **AI Agentic Workflow**. If you are an AI agent or a developer collaborating with an AI assistant, please adhere to the following established protocols:

1. **Read the Rules**: Before beginning any session, read `AGENTS.md` and `CONTEXT.md` in the repository root. `CONTEXT.md` acts as the definitive dictionary for all domain terminology (e.g. use "Participant" instead of "user", "Daily Routine" instead of "medication").
2. **Use the Skills**: This repository provides localized agent skills in the `.agents/skills/` directory. Use the corresponding slash commands to trigger these workflows:
   - `/tdd`: For test-driven feature development or bug fixes (Red → Green → Refactor).
   - `/qa`: To simulate conversational testing and report bugs directly as GitHub issues.
   - `/to-issues`: To break down PRDs into atomic implementation tasks.
   - `/grill-with-docs`: For interviewing the user on architectural or domain decisions before building.
3. **Architecture Rules**: 
   - All conversation flows must export `start(message, user)` and `handle(message, user)`, as well as a `supportedStates` array.
   - The central `Router` dynamically delegates to these flows.
   - External services (like Firebase or WhatsApp API) must be mocked in all test suites to prevent side effects.

### Documentation
When making non-obvious design or architectural decisions, please record them by creating an Architecture Decision Record (ADR) in the `docs/adr/` folder.
