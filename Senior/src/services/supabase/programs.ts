import { supabase } from './client';

export interface Program {
  Program_ID: number;
  Program_Name: string;
  College_Name: string;
}

/**
 * Retrieve one program by its ID — used to turn a Student's Program_ID
 * foreign key into a readable program/college name in the UI.
 */
export async function getProgramById(
  programId: number | string
): Promise<Program | null> {
  const { data, error } = await supabase
    .from('Program')
    .select('*')
    .eq('Program_ID', programId)
    .maybeSingle();

  if (error) {
    console.error('Error loading program:', error);
    throw error;
  }

  return data as Program | null;
}
