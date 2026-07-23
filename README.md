# 🩺 MedAssist AI

**A calm, multilingual(Urdu, English, Arabic) AI health companion — built to demonstrate production-grade full-stack engineering, not to replace a doctor.**

[![Live Demo](https://img.shields.io/badge/demo-live-6B8F61?style=for-the-badge)](#)
[![Frontend](https://img.shields.io/badge/frontend-Vercel-000000?style=for-the-badge&logo=vercel)](#)
[![Backend](https://img.shields.io/badge/backend-Render-46E3B7?style=for-the-badge&logo=render)](#)
[![License](https://img.shields.io/badge/license-MIT-7C93A8?style=for-the-badge)](#license)

> ⚠️ **This is not a medical device.** It does not diagnose, treat, or provide emergency response. Every response includes a disclaimer to consult a licensed doctor. See [Responsible AI Design](#-responsible-ai-design) for how this is enforced at three separate layers.

<p align="center">
  <img src="./docs/demo.gif" alt="AI Symptom Chat demo" width="800"/>
  <br/>
 <!-- <em>Replace this with your ScreenToGif recording before publishing — see the "Before you publish" checklist below.</em> -->
</p>

---

<!-- ## 🔗 Live Demo

| | |
|---|---|
| **Frontend** | [your-vercel-url.vercel.app](#) |
| **Backend API** | [your-render-url.onrender.com/api/health](#) *(cold start may take 10–20s on first load — free tier)* |

--->

## Why this project exists

Healthtech sits at the intersection of three things that are genuinely hard to get right at once: **real-time AI integration**, **responsible-AI guardrails**, and **international accessibility**. This project was built specifically to demonstrate all three — targeting junior full-stack roles in the **UK and UAE** markets, where healthtech and multilingual product experience are both high-value, uncommon skills for junior candidates to show working code for.

---

## ✨ Features

### Core
- **Real-time streaming AI chat** — responses stream token-by-token via Server-Sent Events (not a fake typewriter effect — see [Architecture](#-architecture) for how structured urgency data is still preserved alongside true streaming)
- **Triage-style urgency classification** — every AI response is scored `self-care` → `see a doctor soon` → `seek urgent care` → `emergency`, color-coded and never presented as a diagnosis
- **Emergency quick-action** — an `emergency`-classified response surfaces a one-tap "Call emergency services" button, using the correct number for the user's selected region (UK 999 / UAE 998)

### Full internationalization (not just translated buttons)
- **English, Arabic, and Urdu**, switchable live from the UI
- Arabic/Urdu trigger genuine **right-to-left layout** — bubble alignment, icon direction, everything flips
- The **AI itself replies in the selected language** — the language selection is passed to the backend and instructs the model directly

### Production-grade engineering signals
- **Desktop-first responsive layout** — sidebar navigation + centered chat + live context panel on desktop, clean mobile fallback below 1024px
- **Defense-in-depth safety architecture** — disclaimers enforced at the AI prompt layer, a server-side safety net, and persistent UI elements (see below)
- **Error boundary** with a calm fallback UI — a crash never shows a blank white screen
- **Rate limiting** to protect the free-tier AI quota, correctly configured for deployment behind a reverse proxy (`trust proxy`)
- **Security headers** via `helmet`
- **Zod-validated** API layer with centralized error handling
- **Voice input** via the Web Speech API (progressive enhancement — gracefully absent on unsupported browsers)
- **Urgency trend chart** — a small live chart (`recharts`) showing how urgency has shifted across a conversation

---

## 🛡️ Responsible AI Design

This is the part of the project I'd point a technical interviewer to first.

Medical-adjacent AI products carry real responsibility, even as a demo. Every layer of this app enforces the same rule — **this tool never diagnoses** — independently, so no single point of failure removes the safeguard:

1. **Prompt layer** — the system prompt explicitly forbids diagnostic language or medication advice, and is instructed to classify emergencies conservatively
2. **Server-side safety net** — if the AI ever omits a disclaimer or urgency field, the backend force-fills it before the response reaches the client (`groqService.ts`)
3. **Persistent UI layer** — a disclaimer banner is always visible above the chat, and every AI response is paired with its own disclaimer text in its triage card, regardless of what the model returned

I made a deliberate architectural choice **not** to hard-code any medical logic (e.g. "if fever > X, urgency = Y") — urgency classification comes entirely from the AI's own reasoning over the conversation. This avoids me, a non-clinician, silently encoding incorrect medical rules into the product.

---

## 🧱 Architecture

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────┐
│   React     │──HTTP─▶│  Express + TS API │──HTTP─▶│             │
│  (Vite/TS)  │◀─SSE───│   (Node.js)       │◀───────│ (Llama 3.3) │
└─────────────┘        └──────────────────┘        └─────────────┘
      │                        │
      │                        └─ Zod validation, rate limiting,
      │                           centralized error handling,
      │                           multilingual system prompts
      │
      └─ localStorage (chat history, profile — no server-side
         persistence, deliberately, for this demo's scope)
```

**Why two AI calls per message?** Structured JSON (`{urgency, disclaimer}`) can't be meaningfully parsed until it's fully received — which would defeat the purpose of streaming. So the conversational reply streams live via SSE, and a second, fast, non-streamed call classifies urgency once the full reply text is known. This is a genuine architectural trade-off, not a workaround — happy to walk through the reasoning in an interview.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Internationalization | react-i18next (EN/AR/UR, full RTL) |
| Data viz | Recharts |
| Backend | Node.js, Express, TypeScript |
| Validation | Zod |
| AI |  (Llama 3.3 70B) — streaming + classification |
| Testing | Jest, Supertest |
| Deployment | Vercel (frontend), Render (backend) |
| CI | GitHub Actions |

---

## 📂 Project Structure

```
ai-symptom-chat/
├── backend/     # Express + TypeScript API — see backend/README.md
├── frontend/    # React + TypeScript UI — see frontend/README.md
└── README.md    # you are here
```

Each folder has its own detailed README covering setup, environment
variables, and implementation notes specific to that half of the stack.

---

## 🚀 Running Locally

You need **two terminals** running simultaneously.

```powershell
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env   
npm run dev             # → http://localhost:3001

# Terminal 2 — frontend
cd frontend
npm install
npm run dev             # → http://localhost:5173
```

Full setup details, environment variables, and troubleshooting are in
[`backend/README.md`](./backend/README.md) and [`frontend/README.md`](./frontend/README.md).

---

## 🧪 Testing

```powershell
cd backend
npm test
```

Covers request validation, disclaimer enforcement, and graceful failure
handling when the AI provider is unreachable — deliberately testing the
*safety* behavior, not just the happy path.

---

## 📈 Performance & Accessibility

*Lighthouse scores (production build) — update these after deployment:*

| Metric | Score |
|---|---|
| Performance | `--` |
| Accessibility | `--` |
| Best Practices | `--` |
| SEO | `--` |

---

## 🗺️ What I'd build next

- Persistent accounts with a real database (currently `localStorage`-only, by design, for this demo's scope)
- Server-side conversation analytics for clinicians (with proper consent + compliance work — HIPAA/UK GDPR/UAE data law, none of which this demo implements)
- Additional languages (Hindi and French would extend the UK/UAE/South-Asia reach further)
- Automated Lighthouse CI checks on every PR

---

## ⚖️ Limitations (stated plainly, on purpose)

- Not a diagnostic tool, not reviewed by medical professionals, not a substitute for professional care
- No authentication — "profile" is a local browser preference, not an account
- `localStorage` is unencrypted and unsuitable for real patient data
- No emergency-detection guarantee — the AI's `emergency` classification is best-effort, not certified

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

## 👤 Author

**Khansa Zahid**
- 📧 khansaaazahid143@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/khansa-zahid)
- 🌍 Islamabad, Pakistan 

---

### Before you publish this repo, replace:
- [ ] `docs/demo.gif` with a real recording (ScreenToGif)
- [ ] Live demo URLs in the table above
- [ ] Lighthouse score table
- [ ] LinkedIn/GitHub/portfolio links
- [ ] Add a `LICENSE` file if you want MIT (or remove that section)
