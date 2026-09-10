import { apiClient } from '../../../services/api/client';
import { CourseCapacityItem } from '../types/raiseCapacity.types';

/**
 * FUTURE BACKEND BOUNDARY — NOT YET CALLED ANYWHERE
 *
 * Currently sourced from features/raise-capacity/mocks/courses.mock.ts
 * (coursesList / courseStudentsData), used by
 * AdminRaiseCapacityDashboard.tsx, StudentRaiseCapacityForm.tsx, and
 * AdminCourseDetailsPage.tsx.
 *
 * Kept feature-scoped rather than in the shared services/api/ folder
 * because this data (course sections and their capacity/waitlist
 * state) is specific to the Raise Capacity feature, not shared with
 * the other four request types.
 */

/** Future source: FastAPI backend (courses/sections table). Persistence: TBD. */
export function listCourses(): Promise<CourseCapacityItem[]> {
  return apiClient.get<CourseCapacityItem[]>('/raise-capacity/courses');
}

/**
 * One row of a course's capacity-petition roster. Not added to the
 * shared domain types — only used within this feature.
 */
export interface CourseCapacityPetition {
  id: string;
  name: string;
  gpa: string;
  creditHours: string;
  requestDate: string;
  status: string;
  priority: string;
}

/**
 * Future source: FastAPI backend (capacity-request records).
 * Persistence: TBD — backend persistence decision.
 * See AdminCourseDetailsPage.tsx's `resolveReviewPath` for how a row
 * here is currently matched back to a real request (bug #4 fix).
 */
export function getCourseCapacityPetitions(courseCode: string): Promise<CourseCapacityPetition[]> {
  return apiClient.get<CourseCapacityPetition[]>(
    `/raise-capacity/courses/${encodeURIComponent(courseCode)}/petitions`
  );
}
