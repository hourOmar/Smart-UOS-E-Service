# Smart UoS E-Service

Smart UoS E-Service is a University of Sharjah Senior Project: a student/admin
portal for submitting and processing academic petitions. This repository
currently contains **the frontend implementation only** — a React
single-page application that runs entirely on local mock data. There is no
backend in this repository yet.

The system is built around five request types:

- **Raise Capacity** — request a seat in an over-capacity course section
- **Incomplete Exam** — request a make-up exam for a documented absence
- **Grade Change** — request a review/correction of a posted grade
- **Course Equivalency** — request credit transfer for an equivalent course
- **Program Change** — request a transfer to a different college/major

Two roles exist today: **Student** and **Admin**. (Authentication is
temporary/simulated — see [Authentication](#authentication) below.)

For the full system architecture (current + planned), see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). For how the codebase is
organized, see [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md). For
a tracked list of every mock/placeholder value in the app, see
[docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md).

## Tech stack

| Concern | Choice |
|---|---|
| Programming language | TypeScript |
| UI library | React (19) |
| Build/dev tool | Vite |
| Styling | Tailwind CSS (v4) |
| Routing | React Router (v7) |
| Icons | Lucide React |

React is a UI library, not a programming language — the actual application
code is written in TypeScript (`.ts`/`.tsx`).

## Run locally

**Prerequisites:** Node.js.

1. Install dependencies:
   ```
   npm install
   ```
2. (Optional) Copy `.env.example` to `.env.local` and set
   `VITE_API_BASE_URL` — see [Environment variables](#environment-variables)
   below. **Not required to run the app today.**
3. Start the dev server:
   ```
   npm run dev
   ```

Other scripts:

```
npm run build       # production build (dist/)
npm run preview     # preview a production build locally
npx tsc --noEmit    # type-check without emitting files (also: npm run lint)
```

## Environment variables

```
VITE_API_BASE_URL=http://localhost:8000
```

This is the only environment variable the frontend currently defines (see
`.env.example`). It configures the base URL a future FastAPI backend would
be reached at, read by `src/services/api/config.ts`.

**The frontend does not require this to be set, and does not require any
backend to be running.** Every page currently reads from local mock data
(`src/mocks/`, and each feature's own `mocks/` folder). The `services/api/`
and feature `api/` modules that reference this variable exist as a prepared
boundary for future integration — see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#frontend--backend-boundary) —
but nothing in the app currently imports or calls them.

Never put secrets in this project's environment files — see
[Security](#security) below.

## Current vs. future architecture

**Current (this repository):**
```
React frontend
   |
   v
Mock data (src/mocks/, src/features/*/mocks/)
```

**Planned (future, not in this repository yet):**
```
React frontend
   |
   v
FastAPI backend
   |
   +-------------------------+
   |                         |
   v                         v
Supabase / PostgreSQL       MongoDB
(relational data)     (non-relational / document data)
```

The frontend is not planned to ever connect to Supabase or MongoDB directly
— all data access goes through FastAPI. Where a specific piece of data will
ultimately live (Supabase vs. MongoDB) has **not** been decided yet in most
cases; those are marked `TBD — backend persistence decision` throughout the
code and in [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md) rather than guessed.

## AI agents

AI agents are **planned backend functionality — none are implemented**.
Nothing in this repository currently calls an LLM, and the frontend never
will directly; agent results would reach the frontend only through FastAPI:

```
React → FastAPI → workflow/orchestrator → relevant agent(s) → FastAPI → React
```

Planned agents, by request type (subject to change during backend design):

- **Orchestrator Agent** (cross-cutting)
- **Raise Capacity:** Request Prioritization Agent, Academic Eligibility
  Agent, Rejection Explanation Agent
- **Incomplete Exam:** Academic Eligibility Agent, Rejection Explanation
  Agent
- **Grade Change:** Academic Eligibility / Case Summary Agent
- **Course Equivalency:** Academic Eligibility Agent, Rejection Explanation
  Agent
- **Program Change:** Academic Eligibility Agent

Duplicate/spam detection is **not** planned as an AI agent — it's planned as
a deterministic backend workflow.

Some pages currently display static text that *resembles* what one of these
agents might eventually produce (e.g. an urgency banner, an eligibility
checklist). These are hardcoded placeholders, clearly marked in code and
tracked in [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md) — see that file
before assuming any specific value is agent output.

## Authentication

Login is **simulated and frontend-only** (see the `TEMPORARY AUTHENTICATION`
comment in `src/features/auth/pages/LoginPage.tsx`). Role is guessed from
the shape of the typed-in email address; the password is never checked
against anything real; there is no session and no persistence. Refreshing
the page, or navigating directly to a URL, always returns to `/login`. This
is expected, not a bug — see
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#authentication-status).

Real authentication will be integrated later. No specific mechanism
(Supabase Auth or otherwise) has been decided.

## Security

The frontend must never contain: database credentials, Supabase
service-role keys, MongoDB connection strings, LLM provider API keys, or any
other backend secret. Only safe, public configuration belongs in `VITE_*`
environment variables (Vite bundles these into client-side JavaScript, so
anything placed there is visible to anyone who loads the app). Sensitive
credentials belong on the backend, once it exists.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — current + planned
  architecture, the frontend/backend boundary, data strategy, agents,
  security boundaries, and current limitations.
- [docs/FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md) — what every
  folder in `src/` is for, and where each of the five request types lives.
- [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md) — a tracked list of every
  mock/placeholder value currently in the app, what will eventually replace
  it, and its status.
