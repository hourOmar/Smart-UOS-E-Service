import { CourseGradeItem } from '../types/gradeChange.types';

/**
 * PLACEHOLDER STUDENT GRADE RECORDS
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (enrollment/grade records).
 * Persistence: TBD — backend persistence decision.
 *
 * Do not leave this hardcoded in production.
 */
export const coursesList: CourseGradeItem[] = [
  {
    id: 'c1',
    code: '[CS-301]',
    name: '[Database Management Systems]',
    instructor: '[Dr. Tariq Al-Husseini]',
    section: '[Sec 02]',
    semester: '[Fall 2025]',
    grade: '[C+]',
    gradeColor: 'text-[#F59E0B] bg-[#FEF3C7] border-[#F59E0B]/30',
    date: '[Dec 20, 2025]',
  },
  {
    id: 'c2',
    code: '[CS-202]',
    name: '[Data Structures & Algorithms]',
    instructor: '[Dr. Nadia Al-Sabah]',
    section: '[Sec 01]',
    semester: '[Fall 2025]',
    grade: '[B]',
    gradeColor: 'text-[#0284C7] bg-[#E0F2FE] border-[#0284C7]/30',
    date: '[Dec 22, 2025]',
  },
  {
    id: 'c3',
    code: '[MATH-201]',
    name: '[Linear Algebra & Applications]',
    instructor: '[Prof. Omar Qasim]',
    section: '[Sec 03]',
    semester: '[Spring 2025]',
    grade: '[B-]',
    gradeColor: 'text-[#F59E0B] bg-[#FEF3C7] border-[#F59E0B]/30',
    date: '[May 28, 2025]',
  },
  {
    id: 'c4',
    code: '[PHYS-101]',
    name: '[University Physics I]',
    instructor: '[Dr. Khaled Mahmoud]',
    section: '[Sec 04]',
    semester: '[Fall 2024]',
    grade: '[C]',
    gradeColor: 'text-[#EF4444] bg-[#FEE2E2] border-[#EF4444]/30',
    date: '[Dec 18, 2024]',
  },
];

/**
 * PLACEHOLDER STUDENT DATA (Grade Change review context)
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (student record).
 * Persistence: TBD — backend persistence decision.
 *
 * Do not leave this hardcoded in production.
 */
export const studentInfo = {
  name: '[Mariam Al-Bannai]',
  id: '[U22107821]',
  email: '[U22107821@sharjah.ac.ae]',
  gpa: '[3.62]',
  credits: '[84/132]',
  standing: '[Good Standing]',
  program: '[B.Sc. Computer Science]',
  college: '[College of Computing and Informatics]',
};

/**
 * PLACEHOLDER COURSE DATA (Grade Change review context)
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (courses/enrollment record).
 * Persistence: TBD — backend persistence decision.
 *
 * Do not leave this hardcoded in production.
 */
export const courseDetails = {
  code: '[CS-301]',
  name: '[Database Management Systems]',
  instructor: '[Dr. Tariq Al-Husseini]',
  section: '[Sec 02]',
  semester: '[Fall 2025]',
  finalGrade: '[C+]',
};
