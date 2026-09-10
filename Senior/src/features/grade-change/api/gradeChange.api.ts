import { apiClient } from '../../../services/api/client';
import { CourseGradeItem } from '../types/gradeChange.types';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Currently sourced from features/grade-change/mocks/gradeChange.mock.ts,
 * used by StudentGradeReviewPage.tsx (coursesList) and
 * AdminGradeChangeReviewPage.tsx (studentInfo, courseDetails).
 */

/**
 * Future source: FastAPI backend (enrollment/grade records).
 * Persistence: TBD — backend persistence decision.
 */
export function listGradedCourses(): Promise<CourseGradeItem[]> {
  return apiClient.get<CourseGradeItem[]>('/grade-change/graded-courses');
}

/**
 * Student summary shown on the admin review page. Not added to the
 * shared StudentProfile type — this is a smaller, review-page-specific
 * subset, not the full profile.
 */
export interface GradeChangeStudentSummary {
  name: string;
  id: string;
  email: string;
  gpa: string;
  credits: string;
  standing: string;
  program: string;
  college: string;
}

/** Future source: FastAPI backend (student record). Persistence: TBD. */
export function getStudentSummary(studentId: string): Promise<GradeChangeStudentSummary> {
  return apiClient.get<GradeChangeStudentSummary>(
    `/grade-change/students/${encodeURIComponent(studentId)}/summary`
  );
}

export interface GradeChangeCourseDetails {
  code: string;
  name: string;
  instructor: string;
  section: string;
  semester: string;
  finalGrade: string;
}

/** Future source: FastAPI backend (courses/enrollment record). Persistence: TBD. */
export function getCourseDetails(requestId: string): Promise<GradeChangeCourseDetails> {
  return apiClient.get<GradeChangeCourseDetails>(
    `/grade-change/requests/${encodeURIComponent(requestId)}/course`
  );
}
