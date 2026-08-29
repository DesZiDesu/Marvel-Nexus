# Marvel Nexus

Marvel Nexus is a mobile-first SillyTavern extension that turns the active Marvel role-play chat into a persistent operations interface.

## Features

- Fullscreen Status, Intel, Missions, World, and Archive tabs
- `/marvel-registration` fullscreen, square-corner role-play registration console
- Persona-linked registration with identity, ability, reality, timeline, world, and opening-scene context
- One-button confirmation that saves the profile, closes the UI, sends the completed registration as the user, and starts the first normal role-play reply
- Secret-identity exposure, secrecy status, and identity-witness tracking
- Per-contact knowledge boundaries with Unknown, Suspected, and Confirmed states
- Faction reputation, hostility, awareness, influence, and stance intelligence
- Investigation Board for discovered facts, theories, contradictions, confidence, and record links
- Mission deadlines, threat levels, linked people/places/factions, consequences, and hidden objectives
- Travel state, destination, ETA, nearby contacts, and location history
- Timeline ledger with Earth-aware events and continuity-conflict alerts
- Multiverse anomaly, variant, and incursion-risk monitoring
- Wand-menu launcher and an Extensions settings drawer
- `/spiderwatch` standalone dimensional-travel interface with a draggable vertical position
- Earth-route selection, red-button confirmation, and white-button reset controls
- Local Web Audio interaction sounds with on/off and volume controls
- High-tech arrival alert that dismisses completely after 4.5 seconds
- Confirmed Spider Watch arrivals update the Nexus operator, world, timeline, anomaly, and archive records
- Responsive iPhone safe-area layout and desktop split views
- English, Thai, and automatic language selection
- Locally bundled Oxanium (English) and Chakra Petch (Thai) interface fonts
- Optional Character Life bridge for Known Contacts and NPC portraits
- Zero-extra-call state tracking from the normal role-play response
- Per-chat state stored in SillyTavern chat metadata
- Queued time advancement: the user selects an amount and unit, and the AI resolves it with the next main-chat reply
- Hidden patches are parsed through a strict allowlist before being saved
- Reduced-motion and compact-layout settings

## Install

In SillyTavern, open **Extensions > Install extension** and use:

```text
https://github.com/DesZiDesu/Marvel-Nexus
```

After installation, open the wand menu and select **Marvel Nexus**.

## Role-play registration

Enter `/marvel-registration` in the main chat. Marvel Nexus uses the active SillyTavern user persona as the character name, so the form does not ask for a duplicate name. Complete the five directly selectable sections and press **Confirm registration**.

Confirmation stores the role-play baseline in the current chat, closes the fullscreen interface, posts all entered context as one user message, and starts one normal assistant generation. It does not make a separate helper-generation request.

## AI synchronization

The extension injects a compact snapshot of the current state into the normal role-play prompt. When the story confirms a change, the assistant appends one invisible `MARVEL_NEXUS_PATCH` HTML comment to that same reply. The extension removes the marker, validates its fields, merges the accepted values, and saves them to the current chat.

Time-advance requests are only queued. They are included with the next user message and remain pending until a valid assistant patch acknowledges them.

## Spider Watch

Enter `/spiderwatch` in the main chat to open the watch. Select an available Earth, press the red hardware button to arm the route, and then send the next normal role-play message. Before that generation begins, Marvel Nexus commits the arrival as the canonical current Earth and location. The following assistant reply therefore receives the new dimension in its prompt, and the Nexus World, Timeline, Anomaly, and Archive views reflect the same destination.

The arrival notice plays once when that next message is sent and is fully dismissed after 4.5 seconds. Watch sounds are generated locally with the browser Web Audio API; they can be disabled or adjusted in the extension settings. On iOS, the first sound requires a direct touch interaction, which opening or pressing the watch provides.

## Character Life integration

When [Character Life](https://github.com/DesZiDesu/character-life) is installed, the Intel tab reads its public RPG bridge. Known Contacts are matched to Character Life NPCs by name or alias, and their active portrait is displayed automatically. Character Life-only NPCs also appear in the contact list. The contact detail shows the active form, life status, relationship, and location, and can open the Character Life dossier directly.

Character Life remains read-only from Marvel Nexus. Marvel Nexus keeps its own trust, suspicion, respect, fear, and knowledge-boundary values in the current chat and never overwrites Character Life data.

The integration is optional. Initials remain as the avatar fallback when Character Life or a portrait is unavailable.

## Files

- `manifest.json` — SillyTavern extension manifest
- `index.js` — UI, persistence, AI synchronization, translations, and interactions
- `registration.js` — fullscreen registration flow and first-message launch
- `style.css` — fullscreen responsive interface and settings styles
- `settings.html` — extension settings drawer
- `assets/holographic.gif` — transparent animated Nexus header asset
- `assets/spider-watch-frame.webp` — transparent Spider Watch hardware frame
- `assets/fonts/` — locally bundled interface fonts and OFL licenses

## Privacy and scope

All state is local to the active SillyTavern chat. The extension does not contact a separate API and does not send a second AI request. Every enabled system is evaluated through the normal role-play reply and merged through the same validated hidden patch.
