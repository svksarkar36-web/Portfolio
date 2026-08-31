# Souvik Sarkar — Portfolio (Next.js)

Full-stack **Next.js (App Router)** version of the portfolio. The React frontend
and the former FastAPI backend now live in one Next.js app: the API is served by
Route Handlers under `/app/api`, so the frontend calls same-origin `/api/...`.

## Tech stack

- **Next.js 15** (App Router, JavaScript/JSX), React 19
- Tailwind CSS + shadcn/ui, Framer Motion, `@react-three/fiber` + three.js
- **MongoDB** (`mongodb` driver), **Resend** (email), **Anthropic SDK** (chatbot, SSE)

## What changed from the CRA + FastAPI version

- CRA/CRACO → Next.js App Router. `App.js`/`index.js` became `app/layout.js`,
  `app/providers.jsx`, and `app/page.js`. `react-router-dom` routes → file routes
  (`/` and `/admin`). The webpack health plugin and `craco.config.js` are gone.
- The Python backend was ported to Route Handlers: `app/api/contact`,
  `contact/messages`, `feed`, `feed/[id]`, `content`, `chat/stream`, `health`.
- The chatbot now uses the **Anthropic SDK** directly (`ANTHROPIC_API_KEY`)
  instead of `emergentintegrations`/`EMERGENT_LLM_KEY`. It streams the same SSE
  frames (`meta` / `delta` / `done` / `error`), so the widget is unchanged.
- API base is now same-origin `"/api"` — `REACT_APP_BACKEND_URL` is no longer used.
- Admin token check uses Node's `crypto.timingSafeEqual` (constant-time).
- Interactive components carry `"use client"`; the admin screen renders
  client-only (`next/dynamic` with `ssr: false`) because it uses `localStorage`.
- Carried over the earlier fixes: constant-time admin auth, real docs, and the
  removed unused `auth` test-ID constants. (The CORS middleware isn't needed —
  same-origin API — so it's dropped; set per-route headers if you add cross-origin
  clients later.)

## Getting started

```bash
npm install            # .npmrc pins legacy-peer-deps for the shadcn/three stack
cp .env.local.example .env.local   # then fill in values
npm run dev            # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## Environment variables

| Variable           | Required | Notes                                                  |
| ------------------ | -------- | ------------------------------------------------------ |
| `MONGO_URL`        | yes      | MongoDB connection string                              |
| `DB_NAME`          | yes      | Database name                                          |
| `ADMIN_TOKEN`      | yes*     | Enables `/admin` + admin APIs; unset ⇒ 401             |
| `ANTHROPIC_API_KEY`| no       | Enables the chatbot; unset ⇒ `/api/chat/stream` → 503  |
| `CHAT_MODEL`       | no       | Defaults to `claude-sonnet-4-6`                        |
| `RESEND_API_KEY`   | no       | Enables contact emails; unset ⇒ sending skipped        |
| `SENDER_EMAIL`     | no       | From-address for Resend                                |
| `OWNER_EMAIL`      | no       | Where contact emails are delivered                     |

## API (same-origin, under `/api`)

| Method | Path                    | Auth        |
| ------ | ----------------------- | ----------- |
| POST   | `/api/contact`          | public      |
| GET    | `/api/contact/messages` | admin token |
| GET    | `/api/feed`             | public      |
| POST   | `/api/feed`             | admin token |
| DELETE | `/api/feed/[id]`        | admin token |
| GET    | `/api/content`          | public      |
| PUT    | `/api/content`          | admin token |
| POST   | `/api/chat/stream`      | public (SSE)|
| GET    | `/api/health`           | public      |

Admin routes expect an `X-Admin-Token` header matching `ADMIN_TOKEN`.

## Deploying

Deploys cleanly to Vercel. Set the environment variables above in the project
settings. Use a hosted MongoDB (e.g. Atlas) since serverless functions can't
reach a local database.
