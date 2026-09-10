import { apiClient } from '../../../services/api/client';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Currently sourced from features/incomplete-exam/mocks/incompleteExam.mock.ts
 * (courses), used by StudentIncompleteExamForm.tsx to populate the
 * "which course is this for" picker, pre-filled with the student's
 * current standing in that course.
 */

/**
 * One course a student can currently request an incomplete-exam
 * make-up for, including their current standing. Not added to the
 * shared domain types — only used within this feature.
 */
export interface IncompleteExamEligibleCourse {
  code: string;
  name: string;
  instructor: string;
  section: string;
  examDate: string;
  department: string;
  standing: string;
}

/**
 * Future source: FastAPI backend (courses/enrollment records).
 * Persistence: TBD — backend persistence decision.
 */
export function listEligibleCourses(): Promise<IncompleteExamEligibleCourse[]> {
  return apiClient.get<IncompleteExamEligibleCourse[]>('/incomplete-exam/eligible-courses');
}
