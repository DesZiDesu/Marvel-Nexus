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
- Earth-616 is always available as the stable return route
- Custom Earth/dimension and optional arrival-point input directly inside Spider Watch
- AI-discovered destination registry updated from the normal role-play reply without an extra generation
- Local Web Audio interaction sounds with on/off and volume controls
- High-tech arrival alert that dismisses completely after 4.5 seconds
- Confirmed Spider Watch arrivals update the Nexus operator, world, timeline, anomaly, and archive records only after the assistant reply completes
- Registration fields with switchable preset and custom-input modes
- Fully localized English/Thai registration and interface copy with bundled Oxanium and Chakra Petch fonts
- Configurable civilian and hero/costume identity images with a Status-page frame switcher
- Team network with editable membership plus AI-updated roles, status, locations, and objectives
- Training sessions queued into the next normal reply; confirmed training can raise the 100-point starting HP and energy maxima
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

Enter `/spiderwatch` in the main chat to open the watch. Select a recorded Earth, enter any custom Earth/dimension and optional arrival point, then press the red hardware button to arm the route. Earth-616 remains a permanent return anchor. Routes discovered during normal role-play are added through the same hidden reply patch, so destination updates do not consume a second AI call.

Send the next normal role-play message after arming. The assistant reply narrates the selected transit first; only after that completed reply does Marvel Nexus commit the new Earth/location and display the arrival notice. The notice is fully dismissed after 4.5 seconds. Watch sounds are generated locally with the browser Web Audio API; they can be disabled or adjusted in the extension settings. On iOS, the first sound requires a direct touch interaction, which opening or pressing the watch provides.

## Identity frames, teams, and training

The Status page can store a civilian image and a hero/costume image for the current chat. Use the two frame buttons to swap manually; confirmed story context can also switch the active frame without changing either saved image.

The Team Network stores the current team name, status, objective, and roster. Members can be entered manually as `Name | Role | Status`, while normal role-play replies can update confirmed membership and field status.

New and newly registered operators start at **100 / 100 HP** and **100 / 100 energy**. Queue a training focus, intensity, and duration from the Status page, then describe or perform it in the next role-play turn. Only training completed in the assistant reply can advance training progress or increase maximum HP/energy.

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
