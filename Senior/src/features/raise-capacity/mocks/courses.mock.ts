import { CourseCapacityItem } from '../types/raiseCapacity.types';

/**
 * PLACEHOLDER COURSE DATA
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (courses/sections table).
 * Persistence: TBD — backend persistence decision.
 *
 * Do not leave this hardcoded in production.
 */
export const coursesList: CourseCapacityItem[] = [
  {
    code: '1501263',
    name: 'Programming I',
    section: 'Section 31',
    capacity: '32/30 (106%)',
    currentEnrollment: 32,
    maxCapacity: 30,
    pendingRequests: 8,
    department: 'Computer Science',
    schedule: 'MW 10:00 - 11:30 AM',
    room: 'Lab W8-102',
    instructor: 'Dr. Ahmed Al Mansoori',
    critical: true,
  },
  {
    code: '1501210',
    name: 'Data Structures & Algorithms',
    section: 'Section 02',
    capacity: '30/30 (100%)',
    currentEnrollment: 30,
    maxCapacity: 30,
    pendingRequests: 5,
    department: 'Computer Science',
    schedule: 'UTH 09:00 - 10:00 AM',
    room: 'Room W8-204',
    instructor: 'Dr. Mona Al Ali',
    critical: true,
  },
  {
    code: '1402101',
    name: 'Calculus I',
    section: 'Section 14',
    capacity: '35/35 (100%)',
    currentEnrollment: 35,
    maxCapacity: 35,
    pendingRequests: 4,
    department: 'Mathematics',
    schedule: 'MW 01:00 - 02:30 PM',
    room: 'Room M7-105',
    instructor: 'Dr. Tariq Saeed',
    critical: false,
  },
  {
    code: '1502201',
    name: 'Digital Logic Design',
    section: 'Section 01',
    capacity: '28/30 (93%)',
    currentEnrollment: 28,
    maxCapacity: 30,
    pendingRequests: 2,
    department: 'Engineering',
    schedule: 'UTH 11:00 - 12:00 PM',
    room: 'Lab E4-201',
    instructor: 'Dr. Ibrahim Al Zarouni',
    critical: false,
  },
  {
    code: '1403210',
    name: 'Physics for Engineers II',
    section: 'Section 05',
    capacity: '30/30 (100%)',
    currentEnrollment: 30,
    maxCapacity: 30,
    pendingRequests: 6,
    department: 'Sciences',
    schedule: 'MW 08:30 - 10:00 AM',
    room: 'Hall S2-101',
    instructor: 'Dr. Fatima Al Nuaimi',
    critical: true,
  },
  {
    code: '1501301',
    name: 'Operating Systems',
    section: 'Section 03',
    capacity: '26/30 (86%)',
    currentEnrollment: 26,
    maxCapacity: 30,
    pendingRequests: 3,
    department: 'Computer Science',
    schedule: 'UTH 01:00 - 02:00 PM',
    room: 'Lab W8-106',
    instructor: 'Dr. Khaled Al Qasimi',
    critical: false,
  },
  {
    code: '1501201',
    name: 'Discrete Mathematics',
    section: 'Section 04',
    capacity: '29/30 (97%)',
    currentEnrollment: 29,
    maxCapacity: 30,
    pendingRequests: 4,
    department: 'Computer Science',
    schedule: 'MW 02:30 - 04:00 PM',
    room: 'Room W8-210',
    instructor: 'Dr. Sarah Hassan',
    critical: false,
  },
  {
    code: '1502497',
    name: 'Senior Graduation Project',
    section: 'Section 01',
    capacity: '20/20 (100%)',
    currentEnrollment: 20,
    maxCapacity: 20,
    pendingRequests: 3,
    department: 'Engineering',
    schedule: 'UTH 03:00 - 04:00 PM',
    room: 'Innovation Hub',
    instructor: 'Prof. Youssef Al Mazroui',
    critical: true,
  },
];

/**
 * PLACEHOLDER STUDENT PETITION DATA (per course)
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (capacity-request records).
 * Persistence: TBD — backend persistence decision.
 *
 * Do not leave this hardcoded in production.
 */
export const courseStudentsData = [
  {
    id: 'U22107821',
    name: '[Student Full Name]',
    gpa: '[3.5]',
    creditHours: '[78]',
    requestDate: 'Mar 15, 2026',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'U22106421',
    name: 'Noor Khalid [Student Name]',
    gpa: '[3.8]',
    creditHours: '[84]',
    requestDate: 'Mar 14, 2026',
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 'U23101145',
    name: 'Mariam Al Nuaimi [Student Name]',
    gpa: '[3.2]',
    creditHours: '[62]',
    requestDate: 'Mar 13, 2026',
    status: 'Approved',
    priority: 'Medium',
  },
  {
    id: 'U21107733',
    name: 'Rashid Al Shamsi [Student Name]',
    gpa: '[2.9]',
    creditHours: '[90]',
    requestDate: 'Mar 12, 2026',
    status: 'Rejected',
    priority: 'Low',
  },
  {
    id: 'U20108912',
    name: 'Hamad Sultan [Student Name]',
    gpa: '[3.6]',
    creditHours: '[102]',
    requestDate: 'Mar 11, 2026',
    status: 'Approved',
    priority: 'High',
  },
  {
    id: 'U22105511',
    name: 'Layla Al Marzouqi [Student Name]',
    gpa: '[3.4]',
    creditHours: '[72]',
    requestDate: 'Mar 10, 2026',
    status: 'Pending',
    priority: 'High',
  },
];
