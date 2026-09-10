# Frontend Structure

This document explains the actual `src/` layout of this repository — every
folder's responsibility, and exactly what exists (or doesn't) for each of
the five request-type features. It reflects the real, current tree, not an
earlier proposal.

## Top-level `src/` tree

```
src/
├── App.tsx                  App-level state (role, search, toast) + mounts the router
├── main.tsx                 React entry point
├── index.css                Global styles / Tailwind entry
├── vite-env.d.ts            Vite client type declarations (import.meta.env typing)
│
├── app/
│   ├── router.tsx            The full route tree + RequireRole guard (see Routing)
│   └── routeHelpers.ts        toRequestSlug/fromRequestSlug — URL-safe request-ID helpers
│
├── layouts/
│   ├── AppLayout.tsx          Shared shell: Sidebar + Header + toast banner + <Outlet/>
│   ├── StudentLayout.tsx      Thin wrapper: AppLayout with role="student"
│   └── AdminLayout.tsx        Thin wrapper: AppLayout with role="admin"
│
├── components/common/
│   ├── Header.tsx, Sidebar.tsx           The persistent shell chrome
│   ├── StatCard.tsx                      Icon+number+label stat tile (dashboards)
│   ├── StatusBadge.tsx                   Small icon+pill status badge (dashboard/table contexts)
│   ├── BackLink.tsx                      "← Back to X" link (two preserved visual variants)
│   ├── FilterTab.tsx                     Pill-style filter tab (list/table pages)
│   ├── ModalShell.tsx                    Overlay + centered card shell for simple modals
│   ├── ApproveRejectCards.tsx            Two-column approve/reject radio-card pair
│   └── FileUploadDropzone.tsx            Static (non-functional) file-upload dropzone box
│
├── features/                 One folder per business domain — see below
│
├── mocks/                    Cross-cutting mock data shared by more than one feature
│   ├── students.mock.ts, admins.mock.ts   Default logged-in-user profiles
│   ├── dashboard.mock.ts                  Dashboard stat-card numbers
│   ├── requests.mock.ts                   Sample AcademicRequest records (dashboards + history)
│   ├── notifications.mock.ts              Header notification-bell feed
│   └── transcripts.mock.ts                Sample transcript rows
│
├── services/api/             The frontend/FastAPI boundary — see below
│
└── types/index.ts            Shared domain types (UserRole, AcademicRequest, StudentProfile, ...)
```

Every folder above exists for a concrete reason found in the code — none
were created speculatively "to match a template."

### `app/`

Owns the route tree and small App-level helpers that don't belong to any
one feature. `router.tsx` is the single source of truth for every URL in
the app (see [Routing](#routing)). `routeHelpers.ts` exists because mock
request IDs are formatted like `#RC-2026-088`, and `#` isn't a clean URL
path segment — these two functions convert between the two forms
consistently everywhere a request ID appears in a route.

### `layouts/`

The visual shell (sidebar + header + toast banner) used to be duplicated
inline in `App.tsx` for every page; it's now one shared `AppLayout`,
composed by two nearly-empty per-role wrappers. `StudentLayout`/
`AdminLayout` exist mainly for a clear, readable call site in the router,
and as a home for any future role-only shell behavior — today they only
fix the `role` prop.

### `components/common/`

Components reused across **more than one feature** (verified by actual
duplication before being extracted — see each component's own file-top
comment for exactly which pages it replaced and why). Nothing here is
feature-specific; feature-specific UI stays inside that feature's own
folder instead.

### `features/`

See [Feature reference](#feature-reference) below for the complete,
per-feature breakdown.

### `mocks/`

Placeholder data used by **more than one feature** (e.g. the logged-in
user's profile, shared by the sidebar, profile page, and several review
pages). Mock data used by only one feature lives inside that feature's own
`mocks/` folder instead — see the per-feature list below. Every export in
every mock file is documented in [docs/PLACEHOLDERS.md](PLACEHOLDERS.md).
Nothing here should ever be mistaken for real production data — every file
carries a `PLACEHOLDER` comment header.

### `services/api/`

The prepared frontend/FastAPI boundary:

| File | Contents |
|---|---|
| `client.ts` | The only place allowed to issue an HTTP request — a small typed `fetch` wrapper (`apiClient.get/post/patch`), pointed at `VITE_API_BASE_URL` |
| `config.ts` | Reads `VITE_API_BASE_URL` from the environment |
| `errors.ts` | `ApiError` — a small typed error class for failed requests |
| `requests.service.ts` | Generic operations shared by all five request types (list, get-by-id, submit decision, create) — mirrors how `AcademicRequest[]` mock data is actually consumed generically today |
| `users.service.ts` | Current user's profile + transcript |
| `notifications.service.ts` | The header notification feed |

**None of this is called by any page today.** Every function is a typed
stub describing an intended future call — the app runs entirely on the
mock files in `mocks/` and each feature's `mocks/` folder. See
[docs/ARCHITECTURE.md §4](ARCHITECTURE.md#4-frontend--backend-boundary).

Feature-specific API modules (where they exist) live inside that feature's
own `api/` folder instead of here — see the per-feature list below.

### `types/index.ts`

Domain types genuinely shared across features: `UserRole`, `PriorityLevel`,
`RequestStatus`, `StudentProfile`, `AdminProfile`, `AcademicRequest`,
`SubmittedRequestData`, `NotificationItem`. Types used by only one feature
live in that feature's own `types/` folder instead (see below). Nothing
here models a database table or document — these describe what the
frontend currently displays, not backend storage.

## Feature reference

Each feature folder contains only the subfolders it actually needs —
`pages/`, and where applicable `mocks/`, `types/`, `api/`, or `components/`.
None were created speculatively.

### `auth`
- **Pages:** `LoginPage.tsx`
- **Mocks / Types / API:** none — login is simulated in-component (see
  the `TEMPORARY AUTHENTICATION` comment in the file).

### `dashboard`
- **Pages:** `AdminDashboard.tsx`, `StudentDashboard.tsx`
- **Mocks / Types / API:** none feature-specific — both pages read the
  shared `src/mocks/dashboard.mock.ts` and `src/mocks/requests.mock.ts`.

### `requests`
- **Components:** `RequestSuccessPage.tsx` — the shared success screen
  shown after submitting *any* of the five request types (not
  student-dashboard-specific, which is why it lives here rather than
  under `dashboard/` or a student-only feature — see its own file-top
  comment for the ephemeral `location.state` design).
- **Mocks / Types / API:** none.

### `raise-capacity`
- **Pages:** `StudentRaiseCapacityForm.tsx`, `AdminRaiseCapacityDashboard.tsx`,
  `AdminCourseDetailsPage.tsx`, `AdminRaiseCapacityReviewPage.tsx`
- **Mocks:** `mocks/courses.mock.ts` — `coursesList` (course sections +
  capacity), `courseStudentsData` (per-course petition roster)
- **Types:** `types/raiseCapacity.types.ts` — `CourseCapacityItem`
- **API:** `api/raiseCapacity.api.ts` — `listCourses`,
  `getCourseCapacityPetitions` (not called by any page — see
  [services/api/](#servicesapi))

### `incomplete-exam`
- **Pages:** `StudentIncompleteExamForm.tsx`, `AdminIncompleteExamReviewPage.tsx`
- **Mocks:** `mocks/incompleteExam.mock.ts` — `courses` (eligible courses
  + current standing)
- **Types:** none — this feature has no dedicated `types/` folder; its
  one mock export doesn't need a named type beyond what's inferred
- **API:** `api/incompleteExam.api.ts` — `listEligibleCourses`

### `grade-change`
- **Pages:** `StudentGradeReviewPage.tsx`, `AdminGradeChangeReviewPage.tsx`
- **Mocks:** `mocks/gradeChange.mock.ts` — `coursesList` (a student's
  graded courses), `studentInfo`, `courseDetails`
- **Types:** `types/gradeChange.types.ts` — `CourseGradeItem`
- **API:** `api/gradeChange.api.ts` — `listGradedCourses`,
  `getStudentSummary`, `getCourseDetails`

### `course-equivalency`
- **Pages:** `StudentCourseEquivalencyPage.tsx`
- **Mocks / Types / API:** **none.** This feature has no dedicated mock
  file, type file, or API module — its form uses local component state
  with hardcoded default values only. If this ever needs shared mock
  data, create `features/course-equivalency/mocks/` at that time; do not
  assume one exists.

### `program-change`
- **Pages:** `StudentProgramChangeCollegesPage.tsx`,
  `StudentProgramChangeMajorsPage.tsx`, `AdminProgramChangeReviewPage.tsx`
- **Mocks:** `mocks/programChange.mock.ts` — `currentStudentData`,
  `colleges` (14-college catalog), `studentData`, `committeeList`
- **Types:** `types/programChange.types.ts` — `CollegeItem`,
  `CommitteeMember`, `MajorItem` (the `majors` *data* array itself stays
  in `StudentProgramChangeMajorsPage.tsx` rather than a mock file, since
  each item's `icon` is a JSX element)
- **API:** `api/programChange.api.ts` — `listColleges`,
  `getCurrentProgram`, `getReviewSummary`, `getCommitteeVotes`

### `request-history`
- **Pages:** `AdminHistoryPage.tsx`, `StudentHistoryPage.tsx`
- **Components:** `HistoryStatusBadge.tsx` — feature-scoped rather than
  `components/common/` because its size differs from the shared
  `StatusBadge` (it's sized for the larger history-card grid) — see its
  own file-top comment.
- **Mocks / Types / API:** none feature-specific — both pages read the
  shared `src/mocks/requests.mock.ts`.

### `settings`
- **Pages:** `SettingsPage.tsx`, `ProfilePage.tsx`
- **Mocks / Types / API:** none feature-specific — both pages read the
  shared `src/mocks/students.mock.ts` and `src/mocks/admins.mock.ts`.

## Routing

The full route tree lives in `src/app/router.tsx`. `App.tsx` owns only
`role`/`searchQuery`/`toastMessage` state and mounts
`<BrowserRouter><AppRoutes .../></BrowserRouter>` — it does not contain a
page switch of any kind.

### Route map

```
/login                                                        (redirects to dashboard if already "logged in")

/student                          → StudentLayout  (RequireRole: student)
  (index)                          → redirect to dashboard
  dashboard                        StudentDashboard
  history                          StudentHistoryPage
  settings                         SettingsPage
  profile                          ProfilePage
  requests/raise-capacity          StudentRaiseCapacityForm
  requests/incomplete-exam         StudentIncompleteExamForm
  requests/grade-change            StudentGradeReviewPage
  requests/course-equivalency      StudentCourseEquivalencyPage
  requests/program-change          StudentProgramChangeCollegesPage
  requests/program-change/:collegeId/majors   StudentProgramChangeMajorsPage
  requests/success                 RequestSuccessPage   (see note below)

/admin                            → AdminLayout  (RequireRole: admin)
  (index)                          → redirect to dashboard
  dashboard                        AdminDashboard
  history                          AdminHistoryPage
  settings                         SettingsPage
  profile                          ProfilePage
  requests/raise-capacity                              AdminRaiseCapacityDashboard
  requests/raise-capacity/courses/:courseCode           AdminCourseDetailsPage
  requests/raise-capacity/review[/:requestId]           AdminRaiseCapacityReviewPage
  requests/incomplete-exam/review[/:requestId]          AdminIncompleteExamReviewPage
  requests/grade-change/review[/:requestId]             AdminGradeChangeReviewPage
  requests/program-change/review[/:requestId]           AdminProgramChangeReviewPage

/                 → redirect (dashboard if logged in, else /login)
* (catch-all)     → same redirect as /
```

`[/:requestId]` means two routes are registered for that path — one with
the param, one without — both rendering the same page component, which
reads the param via `useParams()` and falls back to generic placeholder
data when it's absent (e.g. reached from a shortcut that doesn't have a
specific record to point at).

### Nested layouts

`StudentLayout`/`AdminLayout` are rendered as the `element` of a parent
`<Route path="/student">`/`<Route path="/admin">`; every route nested
under them renders into that layout's `<Outlet/>`, so the sidebar/header
never need to be re-mounted per page.

### `RequireRole`

A guard component rendered as the `element` of a route with no `path`,
wrapping the student/admin route trees. It reads `role` (plain React state
in `App.tsx`, not a verified session) and either redirects to `/login`
(no role), redirects to the caller's own dashboard (wrong role), or
renders `<Outlet/>` (correct role). This is a UX guard, not real
authorization — see
[docs/ARCHITECTURE.md §6](ARCHITECTURE.md#6-authentication-status).

### Route parameters over object payloads

Wherever a route needs to identify a specific persistent record — a
request (`:requestId`), a course (`:courseCode`), a college
(`:collegeId`) — the app uses a **route parameter**, not data passed
through React Router's `location.state` or an old-style prop. This is
deliberate: the intended future flow is

```
route parameter → FastAPI → backend record
```

Today, with no backend, each page resolves its route parameter by looking
up the matching record in the relevant mock array (e.g.
`AdminRaiseCapacityReviewPage.tsx` matches `:requestId` against
`sampleAdminRequests`). **This mock lookup is not the final backend
implementation** — it's a frontend-only stand-in for the FastAPI call that
will eventually replace it, chosen specifically so that swap is
straightforward later.

Two examples worth calling out by name:

- **Program Change college route**
  (`requests/program-change/:collegeId/majors`) — `:collegeId` is the
  stable slug already present in every mock `CollegeItem` (`'cci'`,
  `'eng'`, ...), not an invented identifier.
- **Raise Capacity request review route**
  (`requests/raise-capacity/review/:requestId`) — the *only* identity this
  page trusts. A student clicked from the course roster is resolved to a
  real request by matching IDs against mock data where that relationship
  genuinely exists in the mock data (3 of 6 sample students); where it
  doesn't, the route has no ID and the page shows its generic fallback
  rather than inventing a match. See `AdminCourseDetailsPage.tsx`'s
  `resolveReviewPath` and its comment for the full explanation.

### The one exception: `location.state`

`requests/success` is the one place `location.state` is used instead of a
route param, deliberately: the data it carries (a just-submitted request's
confirmation details) is **ephemeral display data for a one-time screen**,
not a persistent record with its own identity worth putting in a URL. A
direct visit or refresh has no state to read, so the page falls back to a
static placeholder object — see `RequestSuccessPage.tsx`'s file-top
comment. Do not confuse this exception with the route-param rule used
everywhere else.

### Catch-all behavior

Both `/` and any unmatched path (`*`) redirect to the caller's own
dashboard if `role` is set, or to `/login` otherwise. There is no custom
404 page.
