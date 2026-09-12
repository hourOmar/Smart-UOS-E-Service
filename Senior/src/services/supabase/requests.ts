import { supabase } from './client';
import { AcademicRequest, PriorityLevel, RequestStatus } from '../../types';

/** Row returned by the request data source. */
interface RequestViewRow {
  id: string;
  created_at: string;
  Request_ID: string | number;
  Request_Type: string;
  Request_Date: string;
  Submission_Time: string;
  Description: string | null;
  Current_Status: string | null;
  Student_ID: string | null;
}

function rowToRequest(row: RequestViewRow): AcademicRequest {
  return {
    id: String(row.Request_ID),
    studentName: 'Unknown',
    studentId: row.Student_ID ?? '',
    type: row.Request_Type,
    courseCode: '',
    courseName: '',
    department: '',
    priority: 'Medium' as PriorityLevel,
    submittedDate: row.Request_Date,
    processedDate: undefined,
    status: (row.Current_Status ?? 'Pending Review') as RequestStatus,
    notes: row.Description ?? undefined,
    reason: row.Description ?? undefined,
  };
}

export async function listActiveRequests(): Promise<AcademicRequest[]> {
  const { data, error } = await supabase
    .from('Request')
    .select('*')
    .order('Request_Date', { ascending: false });

  if (error) {
    console.error('Error loading active requests:', error);
    throw error;
  }

  return ((data ?? []) as RequestViewRow[]).map(rowToRequest);
}

export async function listStudentRequests(studentId: string): Promise<AcademicRequest[]> {
  const { data, error } = await supabase
    .from('Request')
    .select('*')
    .eq('Student_ID', studentId)
    .order('Request_Date', { ascending: false });

  if (error) {
    console.error('Error loading student requests:', error);
    throw error;
  }

  return ((data ?? []) as RequestViewRow[]).map(rowToRequest);
}

export async function listRequestHistory(): Promise<AcademicRequest[]> {
  const { data, error } = await supabase
    .from('Request')
    .select('*')
    .order('Request_Date', { ascending: false });

  if (error) {
    console.error('Error loading request history:', error);
    throw error;
  }

  return ((data ?? []) as RequestViewRow[]).map(rowToRequest);
}

export interface NewRaiseCapacityRequest {
  requestId: number;
  studentId: string;
  courseId: number;
  sectionId: number;
  reason: string;
  submittedDate: string;
}

export async function createRaiseCapacityRequest(
  req: NewRaiseCapacityRequest,
): Promise<void> {
  const { error: requestError } = await supabase.from('Request').insert({
    Request_ID: req.requestId,
    Request_Type: 'Raise Capacity',
    Request_Date: req.submittedDate,
    Priority_Level: 'Medium',
    Submission_Time: new Date().toISOString().slice(11, 19),
    Description: req.reason,
    Student_ID: req.studentId,
  });

  if (requestError) {
    console.error('Error creating Request:', requestError);
    throw requestError;
  }

  const { error: subtypeError } = await supabase.from('Raise_Capacity').insert({
    Request_ID: req.requestId,
    Reason: req.reason,
    Course_ID: req.courseId,
    Section_ID: req.sectionId,
  });

  if (subtypeError) {
    console.error('Error creating Raise_Capacity:', subtypeError);
    await supabase.from('Request').delete().eq('Request_ID', req.requestId);
    throw subtypeError;
  }
}
