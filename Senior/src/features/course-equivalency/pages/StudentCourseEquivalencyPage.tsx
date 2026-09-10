import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Phone,
  Mail,
  FileCheck,
} from 'lucide-react';
import { SubmittedRequestData } from '../../../types';
import { BackLink } from '../../../components/common/BackLink';

interface StudentCourseEquivalencyPageProps {
  onToast: (msg: string) => void;
}

interface CourseItem {
  code: string;
  title: string;
  credits: string;
  grade?: string;
}

export const StudentCourseEquivalencyPage: React.FC<StudentCourseEquivalencyPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  // Current step in progress bar. The setter is intentionally unused:
  // this form has always rendered as a single page/step (the step
  // indicator below never actually advances) — pre-existing from the
  // original generated code, not something Phase 9 changed.
  const [currentStep] = useState<number>(1);

  // Section 1: Major Information
  const [majorName, setMajorName] = useState<string>('[B.Sc. Electrical Engineering]');
  const [datesFrom, setDatesFrom] = useState<string>('2023-09-01');
  const [datesTo, setDatesTo] = useState<string>('2025-06-30');
  const [prevGpa, setPrevGpa] = useState<string>('3.45');
  const [totalCredits, setTotalCredits] = useState<string>('36');

  // Section 2: Previous Course & Requested Course
  const [previousCourse, setPreviousCourse] = useState<CourseItem>({
    code: '[EE-101]',
    title: '[Introduction to Circuits & Logic]',
    credits: '3',
    grade: '[A]',
  });

  const [requestedCourse, setRequestedCourse] = useState<CourseItem>({
    code: '[MATH-110]',
    title: '[Calculus for Engineers II]',
    credits: '4',
  });

  // Section 3: Confirmations
  const [confirmAccuracy, setConfirmAccuracy] = useState<boolean>(true);
  const [confirmOfficialDocs, setConfirmOfficialDocs] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subData: SubmittedRequestData = {
      requestId: `[#CE-2026-${Math.floor(100 + Math.random() * 900)}]`,
      requestType: 'Course Equivalency Request',
      course: `${previousCourse.code} (${previousCourse.grade}) → ${requestedCourse.code}`,
      submittedDate: '[Today, Mar 2026]',
      estimatedProcessing: '[10-14 Working Days]',
      status: 'Pending Review',
      details: `Equivalency evaluation from ${previousCourse.code} (${previousCourse.title}, Grade: ${previousCourse.grade}) to ${requestedCourse.code} (${requestedCourse.title}).`,
    };

    onToast('Petition submitted successfully to academic committee.');
    navigate('/student/requests/success', { state: subData });
  };

  return (
    <div id="student-course-equivalency-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <BackLink onClick={() => navigate('/student/dashboard')} variant="wide">
          ← Back to Dashboard
        </BackLink>
      </div>

      {/* Header Section */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          Course Equivalency Request
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Submit a request to have courses from another major evaluated for credit transfer
        </p>
      </header>

      {/* Information Banner (Light Blue) */}
      <div className="bg-[#F0F4FF] border border-[#BFDBFE] p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-[#1E40AF]">
        <span className="text-lg shrink-0">ℹ️</span>
        <p className="font-medium leading-relaxed">
          Please provide complete information about your previous major and courses. All documents must be official or certified copies.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#E5E7EB] -z-0" />
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                currentStep >= 1 ? 'bg-[#059669] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              1
            </div>
            <span className="text-xs font-bold text-[#059669]">1. Major</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                currentStep >= 2 ? 'bg-[#059669] text-white' : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
              }`}
            >
              2
            </div>
            <span className="text-xs font-semibold text-[#6B7280]">2. Courses</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                currentStep >= 3 ? 'bg-[#059669] text-white' : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
              }`}
            >
              3
            </div>
            <span className="text-xs font-semibold text-[#6B7280]">3. Review</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form vs Summary & Help */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 8 Cols */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Previous Institution Information */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F4F6]">
              <span className="w-6 h-6 rounded-full bg-[#059669] text-white text-xs font-extrabold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-bold text-[#1F2937]">Current / Previous Major Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="font-bold text-[#1F2937]">Major / Program Name *</label>
                <input
                  type="text"
                  required
                  value={majorName}
                  onChange={(e) => setMajorName(e.target.value)}
                  className="p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] outline-hidden text-[#1F2937]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F2937]">Dates Attended From *</label>
                <input
                  type="date"
                  required
                  value={datesFrom}
                  onChange={(e) => setDatesFrom(e.target.value)}
                  className="p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] outline-hidden text-[#1F2937]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F2937]">Dates Attended To *</label>
                <input
                  type="date"
                  required
                  value={datesTo}
                  onChange={(e) => setDatesTo(e.target.value)}
                  className="p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] outline-hidden text-[#1F2937]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F2937]">Cumulative GPA *</label>
                <input
                  type="text"
                  required
                  value={prevGpa}
                  onChange={(e) => setPrevGpa(e.target.value)}
                  className="p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] outline-hidden text-[#1F2937]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[#1F2937]">Total Credit Hours Completed *</label>
                <input
                  type="number"
                  required
                  value={totalCredits}
                  onChange={(e) => setTotalCredits(e.target.value)}
                  className="p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] outline-hidden text-[#1F2937]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Course Information */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#059669] text-white text-xs font-extrabold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-[#1F2937]">Course Information</h2>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Previous Course Card */}
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#059669]">Previous Course</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Course Code *</label>
                    <input
                      type="text"
                      required
                      value={previousCourse.code}
                      onChange={(e) =>
                        setPreviousCourse({ ...previousCourse, code: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:border-[#059669] outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={previousCourse.title}
                      onChange={(e) =>
                        setPreviousCourse({ ...previousCourse, title: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:border-[#059669] outline-hidden"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Credit Hours *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={previousCourse.credits}
                      onChange={(e) =>
                        setPreviousCourse({ ...previousCourse, credits: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:border-[#059669] outline-hidden"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Grade *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. [A], [B+]"
                      value={previousCourse.grade || ''}
                      onChange={(e) =>
                        setPreviousCourse({ ...previousCourse, grade: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] font-bold text-[#059669] focus:border-[#059669] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Requested Course Card */}
              <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#059669]">Requested Course</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Course Code *</label>
                    <input
                      type="text"
                      required
                      value={requestedCourse.code}
                      onChange={(e) =>
                        setRequestedCourse({ ...requestedCourse, code: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:border-[#059669] outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={requestedCourse.title}
                      onChange={(e) =>
                        setRequestedCourse({ ...requestedCourse, title: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:border-[#059669] outline-hidden"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-[#4B5563]">Credit Hours *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={requestedCourse.credits}
                      onChange={(e) =>
                        setRequestedCourse({ ...requestedCourse, credits: e.target.value })
                      }
                      className="p-2.5 rounded-lg border border-[#D1D5DB] bg-white text-[#1F2937] focus:border-[#059669] outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Review & Submit */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F3F4F6]">
              <span className="w-6 h-6 rounded-full bg-[#059669] text-white text-xs font-extrabold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-bold text-[#1F2937]">Review & Submit</h2>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-[#374151]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmAccuracy}
                  onChange={(e) => setConfirmAccuracy(e.target.checked)}
                  className="mt-0.5 rounded text-[#059669] focus:ring-[#059669] w-4 h-4"
                />
                <span>
                  I confirm that all provided course information and descriptions are accurate and correspond to official transcripts.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmOfficialDocs}
                  onChange={(e) => setConfirmOfficialDocs(e.target.checked)}
                  className="mt-0.5 rounded text-[#059669] focus:ring-[#059669] w-4 h-4"
                />
                <span>
                  I understand that credit transfer decisions are governed by the College Academic Committee and University Transfer Policy.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3F4F6]">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={!confirmAccuracy || !confirmOfficialDocs}
                className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all"
              >
                Submit Request
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Summary & Help (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Request Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3 text-xs">
            <h3 className="font-bold text-xs text-[#1F2937] pb-2 border-b border-[#F3F4F6]">
              Request Summary
            </h3>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Target Program:</span>
              <span className="font-semibold text-[#1F2937]">[B.Sc. Computer Science]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Previous Course:</span>
              <span className="font-bold text-[#1F2937]">{previousCourse.code} ({previousCourse.grade})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Requested Course:</span>
              <span className="font-bold text-[#059669]">{requestedCourse.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Transfer Credits:</span>
              <span className="font-bold text-[#1F2937]">{requestedCourse.credits} credits</span>
            </div>
          </div>

          {/* Required Documents List */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3 text-xs">
            <h3 className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5 pb-2 border-b border-[#F3F4F6]">
              <FileCheck className="w-4 h-4 text-[#059669]" />
              <span>Required Documents</span>
            </h3>
            <ul className="flex flex-col gap-2 text-[#4B5563]">
              <li className="flex items-center gap-2">
                <span className="text-[#059669]">✓</span> Official Sealed Transcript
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#059669]">✓</span> Grading Scheme & Scale Document
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#059669]">✓</span> Transfer Eligibility Letter
              </li>
            </ul>
          </div>

          {/* Help & Academic Advisory Section */}
          <div className="bg-[#F0FDF4] p-5 rounded-2xl border border-[#A7F3D0] shadow-xs flex flex-col gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#065F46] font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>Transfer Advisory Support</span>
            </div>
            <p className="text-[#047857] leading-relaxed">
              Need assistance mapping your coursework or obtaining syllabus verification? Contact Academic Advisory:
            </p>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#A7F3D0]/60 text-[#065F46] font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>+971 6 505 [0000]</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>transfer@sharjah.ac.ae</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
