/**
 * PLACEHOLDER TRANSCRIPT DATA
 *
 * TODO: Replace with data returned by the FastAPI backend.
 *
 * Future source:
 * FastAPI backend (enrollment/transcript records).
 * Persistence: TBD — backend persistence decision.
 *
 * Do not leave this hardcoded in production.
 */
export const studentTranscriptSample = [
  { code: '1501157', title: 'Intro to Computing', grade: 'A', credits: '3', term: 'Fall 2023' },
  { code: '1402101', title: 'Calculus I', grade: 'B+', credits: '3', term: 'Fall 2023' },
  { code: '1501201', title: 'Discrete Math', grade: 'A-', credits: '3', term: 'Spring 2024' },
  { code: '1501210', title: 'Data Structures', grade: 'B+', credits: '3', term: 'Fall 2024' },
  { code: '1502201', title: 'Digital Logic', grade: 'A', credits: '3', term: 'Spring 2025' },
];

/**
 * PLACEHOLDER — CURRENTLY UNUSED
 *
 * Not imported anywhere in the codebase (re-confirmed during the
 * Phase 9 cleanup audit). Kept rather than deleted: this is a
 * plausible future data need — a grade-category breakdown table like
 * this would naturally belong on AdminIncompleteExamReviewPage.tsx,
 * which doesn't show one today but reasonably could. This is
 * "currently unused because that detail view hasn't been built yet,"
 * not dead generated data (contrast with the old `requestTypeCards`
 * array formerly in dashboard.mock.ts, which described a defunct
 * navigation model and was deleted in Phase 9).
 *
 * Future source: FastAPI backend. Persistence: TBD — backend
 * persistence decision.
 */
export const incompleteExamGradeBreakdown = [
  { item: 'Assignments & Projects', weight: '20%', earned: '18 / 20' },
  { item: 'Quizzes (4 total)', weight: '15%', earned: '13.5 / 15' },
  { item: 'Midterm Examination', weight: '25%', earned: '21.5 / 25' },
  { item: 'Lab Work & Practical', weight: '15%', earned: '15 / 15' },
  { item: 'Final Exam (Pending)', weight: '25%', earned: 'Pending Incomplete' },
];
