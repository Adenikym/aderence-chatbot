# Flat State and Step Model for Routing

## Context

We needed a way to track where a Participant is within a conversation to route their incoming messages to the correct logic block. A user might be in the middle of onboarding, answering a daily check-in, or navigating a deep sub-menu in the knowledge section.

## Decision

We chose a **Flat State + Step Model**, storing `state` (e.g., `idle`, `onboarding`, `knowledge`) and a nullable `step` (e.g., `ask_name`, `transmission_menu`) directly on the Participant Record in Firestore. A central `Router` checks the `state` and delegates the message to the corresponding Flow module.

## Consequences

- **Simplicity:** No external state-machine frameworks (like XState) or complex session management libraries are required. The current context is easily inspectable in the database.
- **Resilience:** The chatbot process is entirely stateless. Server restarts or load balancing will not affect in-progress conversations because state is persisted in Firestore.
- **Coupling:** Flow modules are tightly coupled to specific string literals for state and step transitions. 
- **Scalability:** As the number of Flows and sub-menus grows (e.g., the `knowledge` Flow), the `handle()` functions can become large `switch` statements. This is manageable for the MVP but may require refactoring into a more structured router if complexity increases.
