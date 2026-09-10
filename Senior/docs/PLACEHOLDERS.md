# Placeholder / Mock Data Tracker

Every meaningful mock/placeholder value currently in the frontend, tracked
here so nothing gets mistaken for real production data or forgotten when
the backend is built. This reflects an actual audit of the repository, not
a plan.

**Statuses used below:**
- `ACTIVE MOCK` — currently imported and rendered by at least one page.
- `TEMPORARY` — a deliberate frontend-only stand-in with no backend
  equivalent planned (e.g. simulated auth), rather than data waiting to be
  fetched.
- `TBD` — future source and/or persistence genuinely undecided; do not
  infer a decision from this table.

**Not placeholders** (do not confuse these with mock data): UI labels
("Approve Request", "Back to Dashboard"), route paths
(`/student/requests/raise-capacity`), the five request-type names
themselves, and Tailwind styling. These are legitimate static frontend
content, not data standing in for a future backend value.

## Tracker

| Location | Placeholder | Current purpose | Future source | Persistence | Status |
|---|---|---|---|---|---|
| `src/mocks/students.mock.ts` | `defaultStudentProfile` | The logged-in student's profile — sidebar, profile page, student dashboard, and two admin review pages (Raise Capacity, Incomplete Exam) fall back to this when no specific student is resolved | FastAPI backend → authenticated user/profile endpoint | TBD — backend persistence decision | ACTIVE MOCK |
| `src/mocks/admins.mock.ts` | `defaultAdminProfile` | The logged-in admin's profile — sidebar, profile page | FastAPI backend → authenticated user/profile endpoint | TBD — backend persistence decision | ACTIVE MOCK |
| `src/mocks/dashboard.mock.ts` | `adminDashboardStats`, `studentDashboardStats` | Top-line stat cards on both dashboards | FastAPI backend → backend-calculated aggregate endpoint | TBD (for the underlying request records) | ACTIVE MOCK |
| `src/mocks/dashboard.mock.ts` | `requestTypeCounts` | Per-request-type pending/total counts shown on the admin dashboard's 5 summary cards | FastAPI backend-calculated endpoint, grouped by request type | TBD | ACTIVE MOCK |
| `src/mocks/requests.mock.ts` | `sampleAdminRequests`, `sampleStudentRequests` | Dashboard request tables (both roles) | FastAPI backend → request endpoint | TBD — likely relational / Supabase-PostgreSQL candidate given the shape (not finalized) | ACTIVE MOCK |
| `src/mocks/requests.mock.ts` | `sampleAdminHistory`, `sampleStudentHistory` | History-page cards (both roles) | FastAPI backend → request endpoint (processed/archived) | TBD — likely relational / Supabase-PostgreSQL candidate | ACTIVE MOCK |
| `src/mocks/notifications.mock.ts` | `studentNotifications`, `adminNotifications` | Header notification-bell dropdown + unread badge | FastAPI backend → notifications feed | TBD — plausibly document-shaped, not confirmed | ACTIVE MOCK |
| `src/mocks/transcripts.mock.ts` | `studentTranscriptSample` | Transcript table on the Raise Capacity admin review page | FastAPI backend → transcript endpoint | TBD | ACTIVE MOCK |
| `src/mocks/transcripts.mock.ts` | `incompleteExamGradeBreakdown` | **Not currently rendered anywhere.** Kept as a plausible future data need for an Incomplete Exam grade-category breakdown view that doesn't exist yet | FastAPI backend, if that detail view is ever built | TBD | TBD (unused) |
| `src/features/raise-capacity/mocks/courses.mock.ts` | `coursesList` | Course/section picker (student form) and course list (admin RC dashboard) | FastAPI backend → courses/sections table | TBD — likely relational candidate | ACTIVE MOCK |
| `src/features/raise-capacity/mocks/courses.mock.ts` | `courseStudentsData` | Per-course capacity-petition roster (admin course-details page) | FastAPI backend → capacity-request records | TBD | ACTIVE MOCK — **known limitation:** only 3 of the 6 sample rows resolve to a real matching request in `sampleAdminRequests`; the other 3 correctly show a generic fallback on the review page rather than a fabricated match (see `resolveReviewPath` in `AdminCourseDetailsPage.tsx`) |
| `src/features/incomplete-exam/mocks/incompleteExam.mock.ts` | `courses` | Eligible-course picker on the student Incomplete Exam form | FastAPI backend → courses/enrollment records | TBD | ACTIVE MOCK |
| `src/features/grade-change/mocks/gradeChange.mock.ts` | `coursesList` | A student's graded-courses list (student Grade Change page) | FastAPI backend → enrollment/grade records | TBD | ACTIVE MOCK |
| `src/features/grade-change/mocks/gradeChange.mock.ts` | `studentInfo`, `courseDetails` | Student + course summary on the admin Grade Change review page | FastAPI backend → student record, courses/enrollment record | TBD | ACTIVE MOCK |
| `src/features/program-change/mocks/programChange.mock.ts` | `colleges` | 14-college catalog (student college-picker page) | FastAPI backend → colleges/programs catalog | TBD — likely relational candidate | ACTIVE MOCK |
| `src/features/program-change/mocks/programChange.mock.ts` | `currentStudentData` | Student's current program summary (both student-facing Program Change pages) | FastAPI backend → student record | TBD | ACTIVE MOCK |
| `src/features/program-change/mocks/programChange.mock.ts` | `studentData` | Student summary on the admin committee-review page (a different shape from `currentStudentData` above — see the mock file's own note on why) | FastAPI backend → student record | TBD | ACTIVE MOCK |
| `src/features/program-change/mocks/programChange.mock.ts` | `committeeList` | Committee approve/reject votes (admin review page) | FastAPI backend → workflow state (not an AI agent output) | TBD — explicitly not finalized as a Supabase relational table; could equally be an embedded array in a document | ACTIVE MOCK |
| `StudentProgramChangeMajorsPage.tsx` (local, not a mock file) | `majors` array | Majors picker under a selected college | FastAPI backend → programs catalog | TBD | ACTIVE MOCK — kept local rather than in `mocks/` because each item's `icon` is a JSX element. **Known limitation:** the same 4 Computing majors are shown regardless of which college was selected; only the page's college-name header reflects the real selection (see [ARCHITECTURE.md §10](ARCHITECTURE.md#10-current-limitations)) |
| `programChange.mock.ts` (`colleges`) + `StudentProgramChangeMajorsPage.tsx` (`majors`) | `gpaMet` / `foundationMet` / `prereqMet` flags | Green-check / red-X eligibility indicators | FastAPI backend → **unconfirmed** whether this is a deterministic eligibility check or the planned Program Change Academic Eligibility Evaluation Agent | TBD | TBD — do not assume agent output |
| `AdminRaiseCapacityReviewPage.tsx` | "New Request Notification" urgency banner + "High Urgency" badge | Illustrative urgency indicator on the review page | FastAPI backend → **plausible but unconfirmed** candidate for the Raise Capacity Request Prioritization Agent | TBD | TBD |
| `AdminIncompleteExamReviewPage.tsx` | Urgency/medical-case badge + banner | Illustrative urgency indicator | FastAPI backend → **not** believed to map to an agent — Incomplete Exam has no prioritization agent in the planned design, only Eligibility + Rejection-Explanation | TBD | TBD |
| `AdminGradeChangeReviewPage.tsx` | Score-audit table (original vs. corrected) + GPA-impact projection | Illustrative case-review detail | FastAPI backend → **plausible but unconfirmed** candidate for the Grade Change Eligibility/Case-Summary Agent; could equally be a deterministic recalculation | TBD | TBD |
| `AdminProgramChangeReviewPage.tsx` | Requirements-check card + "Study Plan Equivalency Mapping" table | Illustrative eligibility/mapping detail | FastAPI backend → **plausible but unconfirmed** candidate for the Program Change Academic Eligibility Evaluation Agent; could equally be a deterministic calculation | TBD | TBD |
| Several pages (dashboards, `AdminCourseDetailsPage.tsx`, `Sidebar.tsx`, `ProfilePage.tsx`) | Assorted bracketed inline literals — e.g. stat-card numbers not yet extracted to a mock file, the sidebar's active-semester/withdrawal-deadline text, the profile page's "Recent Administrative Activity" feed | Illustrative static content, each individually marked with its own `PLACEHOLDER` code comment at the point of use | FastAPI backend-calculated endpoint (stat-like values) or record fields (record-like values) — varies by site, see each comment | TBD | TEMPORARY — intentionally not centralized into a mock file (each is a single-file, single-use literal, not shared data) |
| `RequestSuccessPage.tsx` | Fallback confirmation object (only rendered with no `location.state`) | UI-only fallback for a direct visit/refresh with nothing to display | N/A — this is not a mock awaiting a backend call, it is a permanent UI fallback for a stateless-navigation edge case | N/A | TEMPORARY (by design, not slated for replacement) |
| `LoginPage.tsx` | Simulated login (role guessed from email shape; password never checked) | Lets the frontend be exercised end-to-end without a backend | N/A — real authentication mechanism not yet decided | N/A | TEMPORARY |

### Sample identity values (names, IDs, GPAs, credit hours, dates)

Every mock file above contains illustrative student names, IDs
(`U22107821`-style), GPAs (`[3.62]`), credit-hour counts (`[84/132]`), and
dates. These are not tracked as separate rows — they're covered by the
specific mock export they belong to, above. All follow the same rule:
**future source is the same FastAPI endpoint as their containing record;
persistence is `TBD` unless otherwise noted.**
