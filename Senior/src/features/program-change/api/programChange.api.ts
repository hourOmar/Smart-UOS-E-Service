import { apiClient } from '../../../services/api/client';
import { CollegeItem, CommitteeMember } from '../types/programChange.types';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Currently sourced from features/program-change/mocks/programChange.mock.ts,
 * used by StudentProgramChangeCollegesPage.tsx, StudentProgramChangeMajorsPage.tsx
 * (currentStudentData, colleges) and AdminProgramChangeReviewPage.tsx
 * (studentData, committeeList).
 */

/** Future source: FastAPI backend (colleges/programs catalog). Persistence: TBD. */
export function listColleges(): Promise<CollegeItem[]> {
  return apiClient.get<CollegeItem[]>('/program-change/colleges');
}

export interface CurrentProgramSummary {
  program: string;
  college: string;
  gpa: string;
  credits: string;
  standing: string;
}

/** Future source: FastAPI backend (student record). Persistence: TBD. */
export function getCurrentProgram(): Promise<CurrentProgramSummary> {
  return apiClient.get<CurrentProgramSummary>('/program-change/current-program');
}

/**
 * Student summary shown on the admin committee-review page. A
 * different shape from CurrentProgramSummary above (year, requested
 * program) — see the mock file's own note on why these were kept
 * separate rather than merged.
 */
export interface ProgramChangeReviewSummary {
  name: string;
  id: string;
  gpa: string;
  credits: string;
  year: string;
  currentProgram: string;
  requestedProgram: string;
  college: string;
}

/** Future source: FastAPI backend (student record). Persistence: TBD. */
export function getReviewSummary(requestId: string): Promise<ProgramChangeReviewSummary> {
  return apiClient.get<ProgramChangeReviewSummary>(
    `/program-change/requests/${encodeURIComponent(requestId)}/summary`
  );
}

/**
 * Future source: FastAPI backend (workflow state — committee
 * approve/reject votes, not an AI agent output — per the mock file's
 * own annotation).
 * Persistence: TBD — backend persistence decision (not finalized as
 * a Supabase relational table; could equally be an embedded array in
 * a document).
 */
export function getCommitteeVotes(requestId: string): Promise<CommitteeMember[]> {
  return apiClient.get<CommitteeMember[]>(
    `/program-change/requests/${encodeURIComponent(requestId)}/committee-votes`
  );
}
