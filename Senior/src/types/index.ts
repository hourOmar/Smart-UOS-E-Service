export type UserRole = 'student' | 'admin';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type RequestStatus =
  | 'Approved'
  | 'Rejected'
  | 'In Progress'
  | 'Pending Review'
  | 'Secretary Review'
  | 'HOD Review'
  | 'Committee Review'
  | 'Awaiting Documents'
  | 'Active';

export interface StudentProfile {
  name: string;
  id: string;
  initials: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  gpa: string;
  credits: string;
  nationality: string;
  dob: string;
  enrollment: string;
  program: string;
  standing: string;
  graduation: string;
  college: string;
  advisor: string;
  semester: string;
}

export interface AdminProfile {
  name: string;
  role: string;
  initials: string;
  email: string;
  phone: string;
  department: string;
  facultyMembers: string;
  studentsCount: string;
  coursesCount: string;
  programsCount: string;
  office: string;
  qualification: string;
}

export interface AcademicRequest {
  id: string;
  studentName: string;
  studentId: string;
  type: string;
  courseCode: string;
  courseName: string;
  department: string;
  priority: PriorityLevel;
  submittedDate: string;
  processedDate?: string;
  lastUpdated?: string;
  status: RequestStatus;
  notes?: string;
  reason?: string;
  gpa?: string;
  creditHours?: string;
  section?: string;
}

export interface SubmittedRequestData {
  requestId: string;
  requestType: string;
  course: string;
  submittedDate: string;
  estimatedProcessing: string;
  status: string;
  details?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}
