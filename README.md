# Marvel Nexus

Marvel Nexus is a mobile-first SillyTavern extension that turns the active Marvel role-play chat into a persistent operations interface.

## Features

- Fullscreen Status, Intel, Missions, World, and Archive tabs
- Wand-menu launcher and an Extensions settings drawer
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

## AI synchronization

The extension injects a compact snapshot of the current state into the normal role-play prompt. When the story confirms a change, the assistant appends one invisible `MARVEL_NEXUS_PATCH` HTML comment to that same reply. The extension removes the marker, validates its fields, merges the accepted values, and saves them to the current chat.

Time-advance requests are only queued. They are included with the next user message and remain pending until a valid assistant patch acknowledges them.

## Character Life integration

When [Character Life](https://github.com/DesZiDesu/character-life) is installed, the Intel tab reads its public RPG bridge. Known Contacts are matched to Character Life NPCs by name or alias, and their active portrait is displayed automatically. Character Life-only NPCs also appear in the contact list. Marvel Nexus keeps its own trust, suspicion, respect, fear, and knowledge-boundary values in the current chat and never overwrites Character Life data.

The integration is optional. Initials remain as the avatar fallback when Character Life or a portrait is unavailable.

## Files

- `manifest.json` — SillyTavern extension manifest
- `index.js` — UI, persistence, AI synchronization, translations, and interactions
- `style.css` — fullscreen responsive interface and settings styles
- `settings.html` — extension settings drawer
- `assets/holographic.gif` — transparent animated Nexus header asset
- `assets/fonts/` — locally bundled interface fonts and OFL licenses

## Privacy and scope

All state is local to the active SillyTavern chat. The extension does not contact a separate API and does not send a second AI request.
