# Rule-Based Conversation Architecture

## Context

The chatbot requires a conversation system to handle interactions with Youth Living with HIV (YLHIV) for adherence monitoring and HIV knowledge dissemination. We needed to choose between a deterministic rule-based architecture (state machines, predefined menus, regex/exact matches) and an AI/LLM-driven natural language architecture.

## Decision

We chose to use a **Rule-Based Conversation Architecture** for the MVP phase, avoiding any LLM or NLP for message routing and response generation.

## Consequences

- **Reliability and Consistency:** We have absolute control over the exact wording of every message. This is a critical safety requirement for clinical information and privacy-neutral language (to prevent Inadvertent Disclosure).
- **Feasibility:** It is significantly faster and cheaper to build, test, and deploy for the Phase 2 co-design sessions (10-20 Participants).
- **Constraint:** Participants must use exact menu numbers or specific keywords to navigate. The system cannot gracefully handle complex natural language queries, requiring robust fallback menus.
- **Future Direction:** Post-MVP or in Phase 3, we may introduce constrained NLP for intent recognition, but the core clinical and check-in flows will likely remain deterministic.
