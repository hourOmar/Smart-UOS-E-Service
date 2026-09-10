# Architecture

This document describes the architecture of Smart UoS E-Service as it
**actually exists today**, and the architecture **planned** for later
phases of the Senior Project. Anything under a "Planned" heading is not
implemented in this repository.

## 1. System overview

Smart UoS E-Service is a University portal for submitting and processing
five kinds of academic petitions (Raise Capacity, Incomplete Exam, Grade
Change, Course Equivalency, Program Change), with two roles: Student and
Admin. This repository is the **frontend only** — a React single-page
application. There is no backend repository yet.

## 2. Current frontend architecture

```
React (TypeScript, Vite, Tailwind CSS, React Router)
   |
   v
Mock data
  src/mocks/                      (cross-cutting: profiles, requests, notifications, transcripts)
  src/features/<feature>/mocks/   (feature-specific: courses, colleges, committee data, ...)
```

Every page reads mock data via a plain import — there is no fetch, no
loading state, and no network request involved in rendering any page today.
Routing is handled entirely client-side by React Router (`src/app/router.tsx`);
there is no server-side rendering and no server-side routing.

## 3. Planned full-stack architecture

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

FastAPI is the only planned backend service. The frontend is not planned to
ever import a Supabase or MongoDB client, hold a connection string, or query
either database directly — see [§4](#4-frontend--backend-boundary).

## 4. Frontend → backend boundary

A boundary for this is already scaffolded in `src/services/api/` and each
feature's `<feature>/api/` folder, but it is **not wired into any page
yet** — see [§9](#9-request-processing-concept) and
[docs/FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md#servicesapi) for exactly
which files exist and what they contain.

Rule for that boundary, today and going forward:

- The frontend talks **only** to FastAPI.
- FastAPI owns all Supabase and MongoDB access.
- FastAPI owns all LLM/agent execution.
- The frontend never holds a database credential, service-role key,
  connection string, or LLM API key (see [§9 Security boundaries](#9-security-boundaries)).

## 5. Relational / non-relational data strategy

The planned datastore split:

- **Supabase / PostgreSQL** — planned relational database layer.
- **MongoDB** — planned non-relational / document-oriented database layer.

**Ownership of most individual data entities has not been decided.** The
codebase deliberately does not assign specific mock data to one datastore
or the other — comments throughout use `Persistence: TBD — backend
persistence decision` rather than guessing. A few entities are noted as
*likely relational / Supabase-PostgreSQL candidates* where their shape is
clearly tabular (e.g. request records, student records), but this is a
frontend-side observation about shape, not a finalized backend decision —
see [docs/PLACEHOLDERS.md](PLACEHOLDERS.md) for the full, per-entity list.

## 6. Authentication status

**Current:** simulated, frontend-only. `src/features/auth/pages/LoginPage.tsx`
guesses a role from the shape of the typed email (a student-ID-shaped local
part → student, anything else → admin); the password is never checked
against anything real.

Limitations, all intentional at this stage:
- No persistent session — nothing is written to `localStorage`, a cookie,
  or anywhere else.
- Refreshing the page, or navigating directly to any URL, always returns to
  `/login` (`role` is plain in-memory React state, owned by `App.tsx`).
- No secure identity verification of any kind.
- Role is frontend state only, not a verified claim from anywhere.

Route protection (`RequireRole` in `src/app/router.tsx`) prevents a student
from browsing admin routes and vice versa **as a UX guard**, not as
security — since role is client-controlled state, this offers no real
protection against a motivated user, which is expected and acceptable for
a prototype behind no real backend.

**Future:** real authentication will be integrated once the backend exists.
No specific mechanism has been finalized — do not assume Supabase Auth or
any other provider until that decision is made explicitly.

## 7. AI / agent architecture

**None of this is implemented.** This section describes the planned design
only.

```
React
   |
   v
FastAPI
   |
   v
Workflow / Orchestrator
   |
   v
Relevant Agent(s)
   |
   v
Result returned through FastAPI
   |
   v
React
```

The frontend never calls an LLM provider directly, in the current codebase
or in this plan. Planned agents:

- **Orchestrator Agent** (cross-cutting, routes work to the agents below)
- **Raise Capacity:** Request Prioritization Agent, Academic Eligibility
  Evaluation Agent, Rejection Explanation Agent
- **Incomplete Exam:** Academic Eligibility Evaluation Agent, Rejection
  Explanation Agent
- **Grade Change:** Academic Eligibility Evaluation / Case Summary Agent
- **Course Equivalency:** Academic Eligibility Evaluation Agent, Rejection
  Explanation Agent
- **Program Change:** Academic Eligibility Evaluation Agent

Duplicate/spam detection is explicitly **not** an AI agent — it's planned
as a deterministic backend workflow, separate from the agents above.

Several admin review pages currently show static banners/checklists that
*resemble* plausible future agent output (an urgency indicator, an
eligibility checklist, a GPA-impact projection). These are hardcoded
placeholder JSX, not data pulled from any agent — each is marked in code
with a comment explaining which agent (if any) it might plausibly map to,
and whether that mapping is confirmed. None is confirmed as of this
writing. Full list in [docs/PLACEHOLDERS.md](PLACEHOLDERS.md).

## 8. Request processing concept

Planned (not implemented): a student submits a request via one of the five
forms → FastAPI persists it and runs any relevant deterministic checks →
for request types with a planned eligibility/prioritization agent, FastAPI
invokes the workflow/orchestrator described in §7 → the resulting
record (with status, and eventually agent output) becomes visible on the
admin dashboard and review pages → an admin makes a decision → the
decision is persisted and reflected back to the student.

Today, this entire flow is simulated by static mock arrays
(`src/mocks/requests.mock.ts` and each feature's own mocks) — submitting a
form does not persist anything; it navigates to a success screen carrying
the submitted values in React Router's `location.state`
(see [docs/FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md#routing) for why route
state was used here specifically, and why it's an intentional exception
to the "prefer route params" rule used everywhere else).

## 9. Security boundaries

The frontend must **not** contain:
- Database credentials
- Supabase service-role keys
- MongoDB connection strings
- LLM provider API keys (OpenAI, Gemini, Anthropic, or otherwise)
- Any other backend secret

Only safe, public configuration belongs in `VITE_*` environment variables —
Vite inlines these into the built client-side JavaScript bundle, so
**anything placed there is visible to every visitor**, not just the
developer. `VITE_API_BASE_URL` (a plain URL, not a secret) is the only one
defined today. Sensitive credentials belong on the backend, once it exists,
not in this repository.

## 10. Current limitations

Intentional, known limitations of the current frontend-only state:

- Mock data is the only active data source; nothing is persisted anywhere.
- `src/services/api/` and each feature's `<feature>/api/` module are
  written but **not called by any page** — see
  [docs/FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md#servicesapi).
- No backend is required to run or use the frontend.
- Authentication is simulated (§6) — no session persists across a refresh.
- Some Program Change colleges do not have a dedicated majors catalog —
  every college's majors page shows the same four Computing majors
  regardless of which college was selected (only the college *name* header
  reflects the actual selection). See `StudentProgramChangeMajorsPage.tsx`.
- Some Raise Capacity course-roster students do not resolve to a real mock
  request — of the 6 sample roster rows, 3 match a real request in
  `sampleAdminRequests` and 3 correctly fall back to generic placeholder
  data rather than a fabricated match. See `AdminCourseDetailsPage.tsx`'s
  `resolveReviewPath`.
- `RequestSuccessPage` uses ephemeral React Router `location.state` for its
  data, with a static fallback shown when that state is absent (e.g. a
  direct visit or a page refresh) — this fallback is a UI-only edge case,
  not a mock intended to be replaced by a backend call.
- AI agents are not implemented (§7).
- Database persistence is not implemented (§2–§5).
- File upload UI (e.g. the Raise Capacity/Incomplete Exam document
  dropzones) is presentational only — there is no real file picker, no
  upload, and no storage integration.
- Several admin review pages display static text that plausibly resembles
  future agent output, but this mapping is unconfirmed in every case — see
  §7 and [docs/PLACEHOLDERS.md](PLACEHOLDERS.md).

For the full, itemized mock/placeholder inventory (location, purpose,
future source, persistence, status), see
[docs/PLACEHOLDERS.md](PLACEHOLDERS.md).
