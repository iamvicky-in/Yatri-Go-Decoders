# Site-wide YATRI AI assistant

## Goal
Add a fast, consistent travel assistant that is reachable from every page without covering important navigation or trip controls. It will answer travel questions, understand the page the traveller is viewing, and help move them into existing YATRI GO flows.

## What will be built
- A floating **Ask YATRI** control on desktop and a compact assistant entry on mobile.
- A responsive chat panel with a clear welcome state, suggested questions, conversation history, loading, stop, retry, and error states.
- Context-aware help based on the current page and saved trip plan, without exposing private account data.
- Useful links in responses for common actions such as planning a trip, exploring places, finding services, viewing bookings, and becoming a vendor.
- Markdown rendering for clear itineraries, lists, budgets, and travel advice.
- Accessible keyboard and screen-reader behavior, plus mobile-safe placement above the bottom navigation.

## AI behavior
- Use Lovable AI with the required `openai/gpt-6-astra` model through a server-only streaming endpoint.
- Send the complete conversation history on each turn and stream both progress and the final answer.
- Keep answers concise, practical, India-travel focused, budget-aware, and transparent when live facts cannot be verified.
- Include current page and saved-plan context so answers are relevant, while keeping account credentials and private backend details out of prompts.
- Surface rate-limit, credit, and configuration errors directly; only transient failures receive bounded retries.

## Files and integration
- Add a server-only AI Gateway provider helper and `/api/chat` streaming route.
- Add a reusable global assistant component and mount it once in the shared page shell.
- Add minimal assistant-specific semantic styling to the existing Modern Railway design system.
- Reuse the existing planner assistant for trip modifications; the global assistant will link travellers to the planner when an action requires changing the saved itinerary.
- Update the roadmap to record the completed site-wide assistant.

## Validation
- Test a real Lovable AI request through the app endpoint.
- Verify opening, sending, streaming, stopping, retrying, links, focus handling, and persistence while navigating.
- Check desktop and mobile layouts on key pages, especially `/plan`, `/services`, and `/dashboard`.
- Confirm the current build remains healthy and no existing planner, booking, map, or navigation flow regresses.
