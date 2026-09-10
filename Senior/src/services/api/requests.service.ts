import { AcademicRequest, SubmittedRequestData } from '../../types';
import { apiClient } from './client';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Generic operations shared by all five request types (Raise
 * Capacity, Incomplete Exam, Grade Change, Course Equivalency,
 * Program Change). This mirrors how the current mock data actually
 * works: `sampleAdminRequests` / `sampleStudentRequests` /
 * `sampleAdminHistory` / `sampleStudentHistory` (src/mocks/requests.mock.ts)
 * are all plain `AcademicRequest[]` consumed generically by the
 * dashboards and history pages regardless of request type, and the
 * admin review pages already resolve a specific request by ID out of
 * that same list (see AdminRaiseCapacityReviewPage.tsx's bug #4 fix).
 *
 * Request-type-specific detail data (course lists, transcripts,
 * committee votes, etc.) lives in each feature's own
 * features/<feature>/api/ module instead — see e.g.
 * features/raise-capacity/api/raiseCapacity.api.ts.
 *
 * Every function here is a typed stub describing the intended future
 * call. No page currently imports or calls this module — all pages
 * still read directly from src/mocks/requests.mock.ts. Do not wire
 * these into pages until FastAPI actually exists.
 *
 * Endpoint paths below are illustrative, not a settled contract —
 * the real routes will be decided when the FastAPI backend is
 * designed.
 */

export type RequestType =
  | 'Raise Capacity'
  | 'Incomplete Exam'
  | 'Grade Change'
  | 'Course Equivalency'
  | 'Program Change';

/**
 * List requests for the current user (student: their own; admin: the
 * full queue). Future source: FastAPI → Supabase and/or MongoDB
 * (TBD — backend persistence decision; see Phase 8 report).
 */
export function listRequests(): Promise<AcademicRequest[]> {
  return apiClient.get<AcademicRequest[]>('/requests');
}

/** List processed/archived requests (the History pages' data source). */
export function listRequestHistory(): Promise<AcademicRequest[]> {
  return apiClient.get<AcademicRequest[]>('/requests/history');
}

/**
 * Look up one request by its ID. Mirrors the lookup
 * AdminRaiseCapacityReviewPage.tsx / AdminIncompleteExamReviewPage.tsx
 * already do against mock data today.
 */
export function getRequestById(requestId: string): Promise<AcademicRequest> {
  return apiClient.get<AcademicRequest>(`/requests/${encodeURIComponent(requestId)}`);
}

/**
 * Submit a staff approve/reject decision on a request. The exact
 * payload fields beyond decision/notes are request-type-specific
 * (e.g. Raise Capacity's new seat count, Incomplete Exam's scheduled
 * date) and are NOT modeled here yet — TBD once the backend schema
 * is designed. `extra` is deliberately `unknown`, not `any`, until
 * that shape is settled.
 */
export function submitDecision(
  requestId: string,
  decision: 'approve' | 'reject',
  notes?: string,
  extra?: unknown
): Promise<void> {
  return apiClient.patch<void>(`/requests/${encodeURIComponent(requestId)}/decision`, {
    decision,
    notes,
    ...(extra !== undefined ? { extra } : {}),
  });
}

/**
 * Submit a new request of the given type. `payload` is intentionally
 * `unknown` rather than a concrete type: each of the five forms
 * currently collects a different set of fields, and no backend
 * request schema exists yet to type it against — inventing one here
 * would misrepresent an unsettled contract as decided. The RESPONSE
 * shape is known, though: every form already builds a
 * `SubmittedRequestData` object today (see e.g.
 * StudentRaiseCapacityForm.tsx's handleSubmit).
 */
export function createRequest(type: RequestType, payload: unknown): Promise<SubmittedRequestData> {
  return apiClient.post<SubmittedRequestData>('/requests', { type, payload });
}
