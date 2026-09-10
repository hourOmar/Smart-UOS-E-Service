import { StudentProfile } from '../types';

/**
 * PLACEHOLDER STUDENT DATA
 *
 * TODO: Replace with student data retrieved through FastAPI.
 *
 * Future source:
 * FastAPI backend (student record).
 * Persistence: TBD — backend persistence decision (Supabase vs.
 * MongoDB not yet decided for this record).
 *
 * Do not leave this hardcoded in production.
 */
export const defaultStudentProfile: StudentProfile = {
  name: '[Student Full Name]',
  id: '[Student ID]',
  initials: '[Student Initials]',
  email: '[Student Email]',
  phone: '[Phone Number]',
  department: '[Department]',
  year: '[Year]',
  gpa: '[GPA]',
  credits: '[Credits Completed]',
  nationality: '[Nationality]',
  dob: '[DOB]',
  enrollment: '[Enrollment Date]',
  program: '[Program Name]',
  standing: '[Academic Standing]',
  graduation: '[Expected Graduation]',
  college: '[College]',
  advisor: '[Advisor Name]',
  semester: '[Current Semester]',
};
