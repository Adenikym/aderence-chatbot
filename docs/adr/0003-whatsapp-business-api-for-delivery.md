# WhatsApp Business API for Message Delivery

## Context

The intervention must reach Youth Living with HIV (YLHIV) aged 15–24 years in Ibadan, Nigeria. We needed to select a digital delivery channel that maximizes engagement while maintaining security and accessibility. Options included SMS, a custom mobile app, or a messaging platform like WhatsApp or Telegram.

## Decision

We chose the **WhatsApp Business API (via Graph API)** as the exclusive channel for message delivery.

## Consequences

- **High Penetration:** WhatsApp is the dominant messaging platform in Nigeria, meaning Participants do not need to download a new, unfamiliar, or potentially stigmatizing application.
- **Cost to Participant:** WhatsApp data bundles are common and affordable, unlike SMS which incurs per-message costs or requires airtime.
- **Rich Media:** WhatsApp supports rich formatting, images, and interactive elements which may be introduced in future iterations of the Knowledge Flow.
- **Dependency:** We are subject to Meta's Business API policies, template message rules (the 24-hour customer service window), and API changes. Outbound reminders (Nudge Messages and Check-In prompts) must comply with WhatsApp's opt-in and template requirements if sent outside the 24-hour window.
