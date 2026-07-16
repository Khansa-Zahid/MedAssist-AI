# AI Symptom Chat — Frontend

React + TypeScript + Tailwind chat UI for the AI Symptom Chat portfolio
project, with profile setup, persistent local chat history, and full
English / Arabic / Urdu support (including right-to-left layout).

> ⚠️ **Not a diagnostic tool.** This is a portfolio demo. It does not
> replace professional medical advice — always consult a licensed doctor.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (custom calming palette — see Design section)
- react-i18next (EN / AR / UR, with automatic RTL switching)
- No backend framework dependency beyond `fetch` — talks to the
  Express + Groq backend from Phase 1–2

## Setup (Windows / VS Code)
1. Open this folder in VS Code (`File → Open Folder`, the one containing
   `package.json`).
2. Open the integrated terminal (`` Ctrl + ` ``) and run:
   ```powershell
   npm install
   ```
3. Make sure the **backend** (from the earlier zip) is already running on
   `http://localhost:3001` in a separate terminal — this frontend expects it.
   A `.env` file is already included here pointing at that address.
4. Start the frontend:
   ```powershell
   npm run dev
   ```
5. Open the URL Vite prints (usually `http://localhost:5173`).

You now need **two terminals running at once**: one for the backend
(`npm run dev` in the backend folder) and one for this frontend.

## What's implemented

### Phase 3 — Chat UI
- Chat bubbles (user vs. assistant), auto-scroll to newest message
- Typing indicator while waiting on the AI
- Error state with a retry button, and a distinct rate-limit message
- Urgency-coded triage card under every AI response (color communicates
  meaning — green/self-care, amber/see-a-doctor-soon, red/urgent or
  emergency — and red is reserved only for those two so it doesn't lose
  meaning through overuse), always paired with the disclaimer text

### Phase 4 — Session, profile, and history
- One-time profile setup: optional name, language choice, and a required
  disclaimer consent checkbox before the chat unlocks
- Chat history and profile persisted in `localStorage` — refreshing the
  page keeps your conversation
- "New conversation" button (with a confirmation prompt) clears history
- Multi-language: **English, Arabic, and Urdu**, switchable anytime from
  the header. Arabic and Urdu automatically flip the whole layout to
  right-to-left, including the message bubble alignment and send-icon
  direction — this isn't just translated labels, the backend's system
  prompt is instructed to reply in the selected language too (see the
  backend's `language` field), so the AI's answers come back in that
  language as well.

## Design notes
The brief asked for a calming color scheme, so this deliberately avoids
both clinical-hospital blue-and-white and the generic "AI portfolio"
cream-and-terracotta look. The palette:
- **Sage** (`#6B8F61`) — primary actions, self-care indicator
- **Dusk** (`#7C93A8`) — the assistant's voice (message bubbles)
- **Mist** (`#EFF2ED`) — background, a cool pale sage-grey rather than warm cream
- **Amber** (`#C99A44`) — "see a doctor soon"
- **Clay** (`#B85C4A`) — urgent/emergency only, kept rare so it stays meaningful
- **Ink** (`#23291F`) — body text

Typography pairs **Fraunces** (a warm serif, used sparingly for the app
name and headings) with **Inter** for body text, **Noto Sans Arabic**
for Arabic, and **Noto Nastaliq Urdu** for Urdu — each language renders
in a face actually designed for it rather than forcing a Latin font.

The signature element is the small "breathing" dot used both as the
brand mark in the header and as the typing indicator — a slow 3.2s pulse
that echoes the app's calming intent literally, not just in copy.

## Environment variables
```
VITE_API_URL=http://localhost:3001   # your backend's URL
```
Update this to your deployed Render URL once you complete Phase 6.

## Known limitations (be upfront about these in interviews)
- `localStorage` is not encrypted and not suitable for real patient data —
  this is explicitly a demo constraint, stated here and in the main README
- No authentication — "profile" is a local nickname/preference only, not
  an account
- Groq's free tier occasionally rotates which models are available; if
  the AI stops responding, check the backend's `MODEL` constant
- Voice input relies on the browser's native Web Speech API, which is
  Chromium-only (Chrome/Edge) — the mic button is simply hidden on
  unsupported browsers (e.g. Firefox) rather than showing a broken control

## Additional features (latest round)

- **Streaming responses** — the AI's reply now streams in token-by-token
  via Server-Sent Events instead of waiting for the full response. See the
  backend README's `/api/chat/stream` section for how urgency/disclaimer
  are still generated without breaking the streaming.
- **Desktop layout** — a left sidebar (nav + new conversation + profile)
  and right context panel (live urgency status, urgency trend chart,
  wellness shortcut) flank a centered chat column on screens ≥1024px.
  Falls back to the original mobile layout (header + bottom tabs) below
  that.
- **Emergency quick-action** — when a response is classified `emergency`,
  a "Call emergency services" button appears with a `tel:` link using the
  correct number for your selected region (UK 999 / UAE 998, set in
  Settings).
- **Urgency trend chart** — a small `recharts` sparkline in the context
  panel showing how urgency has shifted across the conversation, once
  there are at least two data points.
- **Voice input** — a microphone button next to the chat input using the
  browser's native Web Speech API (no backend involved, free, no API key).
- **Error boundary** — a crash anywhere in the React tree shows a calm
  fallback screen with a reload button instead of a blank white page.
  Chat history is preserved in `localStorage` regardless.
