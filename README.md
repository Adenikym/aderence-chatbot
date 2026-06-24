# Adherence Chatbot

A WhatsApp-based medication adherence chatbot designed to help participants maintain their daily wellness routines. The bot securely registers users, parses natural language time inputs for daily reminders, dispatches scheduled notifications via the Meta WhatsApp Cloud API, and logs participant check-ins using Firebase Firestore.

## Technology Stack
- **Server:** Node.js, Express
- **Database:** Firebase Cloud Firestore
- **Messaging:** Meta WhatsApp Cloud API (`v25.0`)
- **Scheduling:** node-cron (In-memory, boot-reconstructed)
- **Deployment:** Railway (with Railpack builder)
- **Testing:** Jest, Supertest

## Prerequisites
- Node.js (v18 or higher)
- Firebase Project with Firestore (Standard Edition)
- Meta Developer Account with WhatsApp Cloud API configured (Sandbox or Live)
- Railway Account (for deployment)

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

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
VERIFY_TOKEN=your_secure_webhook_verify_token
WHATSAPP_TOKEN=your_permanent_system_user_token
PHONE_NUMBER_ID=your_meta_phone_number_id
FIREBASE_SERVICE_ACCOUNT_BASE64=base64_encoded_firebase_admin_json
```

### 4. Run the Server Locally
```bash
npm start
```
The server will start on `http://localhost:3000`. You can expose this local port using a tool like `ngrok` to test Meta webhooks locally.

## Testing

This project strictly follows Test-Driven Development (TDD). Tests are written in Jest and co-located in the `__tests__` directory, mirroring the source structure.

To run the comprehensive test suite:
```bash
npm test
```

## Contributing (Agentic Workflow)

This codebase is maintained using a strict Agentic AI workflow. To contribute or add features, please follow these steps with your AI agent:

1. **Grill and Align:** Use the `/grill-with-docs` skill to debate and finalize architectural decisions before writing code. Update `CONTEXT.md` and `docs/adr/` with any new domain terms or architectural decisions.
2. **Generate PRD:** Use the `/to-prd` skill to write a comprehensive Product Requirements Document and publish it to the GitHub issue tracker.
3. **Slice into Issues:** Use the `/to-issues` skill to break the PRD down into small, vertical, independently grabbable tasks (Tracer Bullets).
4. **Test-Driven Development:** For each issue, use the `/tdd` skill to implement the feature following the Red-Green-Refactor cycle. *Write the failing test first.*
5. **Atomic Commits:** Commit your changes to the remote repository using standard Git commit conventions after each completed issue.

## License
Private. All rights reserved.
