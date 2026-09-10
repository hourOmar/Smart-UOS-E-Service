export interface CourseCapacityItem {
  code: string;
  name: string;
  section: string;
  capacity: string;
  currentEnrollment: number;
  maxCapacity: number;
  pendingRequests: number;
  department: string;
  schedule: string;
  room: string;
  instructor: string;
  critical?: boolean;
}
