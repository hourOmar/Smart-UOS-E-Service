import { supabase } from './client';

export interface Student {
  id: string;
  Student_id: string;
  created_at: string;
  Student_Name: string;
  Student_Email: string;
  CGPA: number | null;
  Completed_Hours: number | null;
  Program_ID: string | null;
  Auth_User_ID: string | null;
}

/**
 * Retrieve all students from the Student table.
 */
export async function listStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('Student')
    .select('*')
    .order('Student_id', { ascending: true });

  if (error) {
    console.error('Error loading students:', error);
    throw error;
  }

  return (data ?? []) as Student[];
}

/**
 * Retrieve one student using their email.
 */
export async function getStudentByEmail(
  email: string
): Promise<Student | null> {
  const { data, error } = await supabase
    .from('Student')
    .select('*')
    .eq('Student_Email', email.trim())
    .maybeSingle();

  if (error) {
    console.error('Error loading student:', error);
    throw error;
  }

  return data as Student | null;
}

/**
 * Retrieve one student using their Student ID.
 */
export async function getStudentById(
  studentId: string
): Promise<Student | null> {
  const { data, error } = await supabase
    .from('Student')
    .select('*')
    .eq('Student_id', studentId.trim())
    .maybeSingle();

  if (error) {
    console.error('Error loading student by ID:', error);
    throw error;
  }

  return data as Student | null;
}