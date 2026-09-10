import { AdminProfile } from '../types';

/**
 * PLACEHOLDER ADMIN / STAFF DATA
 *
 * TODO: Replace with admin/staff data retrieved through FastAPI.
 *
 * Future source:
 * FastAPI backend (staff/admin record).
 * Persistence: TBD — backend persistence decision (Supabase vs.
 * MongoDB not yet decided for this record).
 *
 * Do not leave this hardcoded in production.
 */
export const defaultAdminProfile: AdminProfile = {
  name: '[Admin Name]',
  role: '[Admin Role]',
  initials: '[Admin Initials]',
  email: '[Admin Email]',
  phone: '+971 6 505 0000',
  department: 'Computer Science',
  facultyMembers: '[28]',
  studentsCount: '[640]',
  coursesCount: '[42]',
  programsCount: '[5]',
  office: 'W8-204, IT Complex',
  qualification: 'Ph.D. in Computer Science',
};
