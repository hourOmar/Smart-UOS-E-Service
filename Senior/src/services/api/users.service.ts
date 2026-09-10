import { StudentProfile, AdminProfile } from '../../types';
import { apiClient } from './client';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Profile data currently comes from src/mocks/students.mock.ts and
 * src/mocks/admins.mock.ts (defaultStudentProfile / defaultAdminProfile),
 * used by Sidebar.tsx, ProfilePage.tsx, StudentDashboard.tsx, and the
 * Raise Capacity / Incomplete Exam admin review pages.
 *
 * Bundled as one "current user profile" service rather than a
 * generic students-list + admins-list API, since nothing in the
 * current frontend browses other students/admins — every usage reads
 * exactly one profile (the temporarily-simulated logged-in user's).
 *
 * No page currently imports or calls this module.
 */

/**
 * Future source: FastAPI backend (student record).
 * Persistence: TBD — backend persistence decision.
 */
export function getStudentProfile(): Promise<StudentProfile> {
  return apiClient.get<StudentProfile>('/students/me');
}

/**
 * Future source: FastAPI backend (staff/admin record).
 * Persistence: TBD — backend persistence decision.
 */
export function getAdminProfile(): Promise<AdminProfile> {
  return apiClient.get<AdminProfile>('/admins/me');
}

/**
 * A single transcript line. Not defined in src/types/index.ts because
 * it is only ever used here and in AdminRaiseCapacityReviewPage.tsx's
 * transcript table — kept local rather than added to the shared
 * domain types for something this narrow.
 */
export interface TranscriptEntry {
  code: string;
  title: string;
  grade: string;
  credits: string;
  term: string;
}

/**
 * Currently sourced from src/mocks/transcripts.mock.ts
 * (studentTranscriptSample), used by AdminRaiseCapacityReviewPage.tsx.
 * Future source: FastAPI backend (enrollment/transcript records).
 * Persistence: TBD — backend persistence decision.
 */
export function getStudentTranscript(studentId: string): Promise<TranscriptEntry[]> {
  return apiClient.get<TranscriptEntry[]>(`/students/${encodeURIComponent(studentId)}/transcript`);
}
