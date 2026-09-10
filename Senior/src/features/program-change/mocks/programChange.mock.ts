import { CollegeItem, CommitteeMember } from '../types/programChange.types';

/**
 * PLACEHOLDER STUDENT DATA (Program Change context)
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (student record).
 * Persistence: TBD — backend persistence decision.
 *
 * This was previously duplicated identically in both
 * StudentProgramChangeCollegesPage.tsx and
 * StudentProgramChangeMajorsPage.tsx — consolidated here as one source.
 *
 * Do not leave this hardcoded in production.
 */
export const currentStudentData = {
  program: '[B.Sc. Computer Science]',
  college: '[College of Computing and Informatics]',
  gpa: '[3.62]',
  credits: '[84/132]',
  standing: '[Good Standing]',
};

/**
 * PLACEHOLDER COLLEGE CATALOG
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (colleges/programs catalog).
 * Persistence: TBD — backend persistence decision.
 *
 * PLACEHOLDER — FUTURE SOURCE TBD for `gpaMet` / `foundationMet`:
 * These look like eligibility computations, but the planned agent
 * architecture has not yet been confirmed to cover Program Change
 * college-level eligibility (only the majors-level "Academic
 * Eligibility Evaluation Agent" is currently listed for Program
 * Change). Do not assume this is AI agent output until confirmed —
 * it may instead be a deterministic backend eligibility check.
 *
 * Do not leave this hardcoded in production.
 */
export const colleges: CollegeItem[] = [
  {
    id: 'cci',
    name: 'College of Computing and Informatics',
    tagline: 'Leading computing, artificial intelligence, cybersecurity & data innovation',
    degreeTypes: 'B.Sc., M.Sc., Ph.D.',
    gpaReq: 'Min GPA: 2.50 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 12/12 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 6,
  },
  {
    id: 'eng',
    name: 'College of Engineering',
    tagline: 'Civil, Electrical, Mechanical, Industrial & Sustainable Energy disciplines',
    degreeTypes: 'B.Sc., M.Sc., Ph.D.',
    gpaReq: 'Min GPA: 2.80 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 15/15 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 8,
  },
  {
    id: 'cba',
    name: 'College of Business Administration',
    tagline: 'Finance, Management, Marketing, Accounting & Business Analytics',
    degreeTypes: 'B.B.A., M.B.A., Ph.D.',
    gpaReq: 'Min GPA: 2.00 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 9/9 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 5,
  },
  {
    id: 'sci',
    name: 'College of Sciences',
    tagline: 'Physics, Chemistry, Applied Mathematics, Biotechnology & Petroleum Geology',
    degreeTypes: 'B.Sc., M.Sc.',
    gpaReq: 'Min GPA: 2.20 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 12/12 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 6,
  },
  {
    id: 'med',
    name: 'College of Medicine',
    tagline: 'Bachelor of Medicine & Surgery (MBBS), Clinical Sciences and Research',
    degreeTypes: 'M.B.B.S., M.Sc.',
    gpaReq: 'Min GPA: 3.80 (Your GPA: 3.62)',
    gpaMet: false,
    foundationReq: 'Pre-Med Foundation: Incomplete',
    foundationMet: false,
    clickable: true,
    programsCount: 2,
  },
  {
    id: 'den',
    name: 'College of Dental Medicine',
    tagline: 'Bachelor of Dental Surgery (BDS) & Advanced Oral Health Specialties',
    degreeTypes: 'B.D.S., M.Sc.',
    gpaReq: 'Min GPA: 3.75 (Your GPA: 3.62)',
    gpaMet: false,
    foundationReq: 'Pre-Dental: Incomplete',
    foundationMet: false,
    clickable: true,
    programsCount: 2,
  },
  {
    id: 'pha',
    name: 'College of Pharmacy',
    tagline: 'Doctor of Pharmacy (PharmD), Clinical Pharmacy & Pharmaceutical Sciences',
    degreeTypes: 'Pharm.D., M.Sc.',
    gpaReq: 'Min GPA: 3.30 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 12/12 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 3,
  },
  {
    id: 'chs',
    name: 'College of Health Sciences',
    tagline: 'Nursing, Medical Lab Sciences, Physiotherapy & Clinical Nutrition',
    degreeTypes: 'B.Sc., M.Sc.',
    gpaReq: 'Min GPA: 2.50 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 12/12 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 6,
  },
  {
    id: 'law',
    name: 'College of Law',
    tagline: 'Private Law, Public Law, International Jurisprudence & Commercial Arbitration',
    degreeTypes: 'LL.B., LL.M., Ph.D.',
    gpaReq: 'Min GPA: 2.20 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 9/9 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 3,
  },
  {
    id: 'com',
    name: 'College of Communication',
    tagline: 'Journalism, Public Relations, Digital Media & Strategic Communications',
    degreeTypes: 'B.A., M.A.',
    gpaReq: 'Min GPA: 2.00 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 6/6 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 4,
  },
  {
    id: 'art',
    name: 'College of Arts, Humanities and Social Sciences',
    tagline: 'Arabic & English Literature, History, Sociology, International Relations',
    degreeTypes: 'B.A., M.A., Ph.D.',
    gpaReq: 'Min GPA: 2.00 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 6/6 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 7,
  },
  {
    id: 'sha',
    name: "College of Shari'a and Islamic Studies",
    tagline: 'Foundations of Religion, Islamic Jurisprudence (Fiqh) & Islamic Banking',
    degreeTypes: 'B.A., M.A., Ph.D.',
    gpaReq: 'Min GPA: 2.00 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 6/6 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 4,
  },
  {
    id: 'fad',
    name: 'College of Fine Arts and Design',
    tagline: 'Interior Design, Visual Communication, Fine Arts & Fashion Design',
    degreeTypes: 'B.F.A., M.F.A.',
    gpaReq: 'Min GPA: 2.30 + Portfolio',
    gpaMet: true,
    foundationReq: 'Studio Assessment Met',
    foundationMet: true,
    clickable: true,
    programsCount: 4,
  },
  {
    id: 'cpp',
    name: 'College of Public Policy',
    tagline: 'Public Administration, Governance, Policy Economics & Urban Strategies',
    degreeTypes: 'B.P.P., M.P.P.',
    gpaReq: 'Min GPA: 2.50 (Your GPA: 3.62)',
    gpaMet: true,
    foundationReq: 'Foundation: 9/9 Cr.',
    foundationMet: true,
    clickable: true,
    programsCount: 3,
  },
];

/**
 * PLACEHOLDER STUDENT DATA (Program Change committee-review context)
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (student record).
 * Persistence: TBD — backend persistence decision.
 *
 * Note: shape differs from `currentStudentData` above because this is
 * used on the admin committee-review page, not the student-facing
 * pages. Kept as a separate export rather than merged, since forcing
 * both into one shape would be a structural change beyond a data move.
 *
 * Do not leave this hardcoded in production.
 */
export const studentData = {
  name: '[Mariam Al-Bannai]',
  id: '[U22107821]',
  gpa: '[3.62]',
  credits: '[84/132]',
  year: '[Year 3]',
  currentProgram: '[Computer Science]',
  requestedProgram: '[Data Science & Artificial Intelligence]',
  college: '[College of Computing and Informatics]',
};

/**
 * PLACEHOLDER COMMITTEE VOTES
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (workflow state — committee approve/reject votes,
 * not an AI agent output).
 * Persistence: TBD — backend persistence decision. This has not been
 * finalized as a Supabase relational table; it could equally be
 * modeled as an embedded array within a document, depending on how
 * the backend is designed.
 *
 * Do not leave this hardcoded in production.
 */
export const committeeList: CommitteeMember[] = [
  {
    name: '[Dr. Tariq Al-Husseini]',
    role: '[Department Head - CS]',
    status: 'Approved',
    comment: 'Strong academic standing, recommended for immediate transfer.',
    date: '[Feb 19, 2026]',
  },
  {
    name: '[Dr. Layla Mansoor]',
    role: '[Academic Advisor]',
    status: 'Approved',
    comment: 'Prerequisites verified.',
    date: '[Feb 20, 2026]',
  },
  {
    name: '[Prof. Omar Qasim]',
    role: '[College Committee Member]',
    status: 'Pending',
  },
  {
    name: '[Dr. Ahmed Al-Ali]',
    role: '[Data Science Track Coordinator]',
    status: 'Pending',
  },
  {
    name: '[Dr. Fatima Al-Zahra]',
    role: '[Dean Representative]',
    status: 'Pending',
  },
];
