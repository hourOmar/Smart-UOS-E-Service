import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';
import { SubmittedRequestData } from '../../../types';
import { CourseGradeItem } from '../types/gradeChange.types';
import { coursesList } from '../mocks/gradeChange.mock';
import { BackLink } from '../../../components/common/BackLink';

interface StudentGradeReviewPageProps {
  onToast: (msg: string) => void;
}

export const StudentGradeReviewPage: React.FC<StudentGradeReviewPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<CourseGradeItem>({
    id: 'c1',
    code: '[CS-301]',
    name: '[Database Management Systems]',
    instructor: '[Dr. Tariq Al-Husseini]',
    section: '[Sec 02]',
    semester: '[Fall 2025]',
    grade: '[C+]',
    gradeColor: 'text-[#F59E0B] bg-[#FEF3C7] border-[#F59E0B]/30',
    date: '[Dec 20, 2025]',
  });

  const [explanation, setExplanation] = useState<string>(
    'I believe there may be a calculation discrepancy on my final exam score and assignment weightings. My midterm exam was [88%] and coursework average was [91%], but the final reported grade is [C+]. I kindly request a clerical verification of the final assessment grade breakdown.'
  );
  const [willingToMeet, setWillingToMeet] = useState<boolean>(true);
  const [understandReviewOnly, setUnderstandReviewOnly] = useState<boolean>(true);
  const [uploadedFile, setUploadedFile] = useState<string>('[Midterm_Work_Graded.pdf]');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subData: SubmittedRequestData = {
      requestId: `[#GR-2026-${Math.floor(100 + Math.random() * 900)}]`,
      requestType: 'Grade Review Request',
      course: `${selectedCourse.code} - ${selectedCourse.name}`,
      submittedDate: '[Today, Mar 2026]',
      estimatedProcessing: '[5-7 Working Days]',
      status: 'Pending Review',
      details: `Review for current grade ${selectedCourse.grade} under ${selectedCourse.instructor}.`,
    };

    onToast('Petition submitted successfully to academic committee.');
    navigate('/student/requests/success', { state: subData });
  };

  return (
    <div id="student-grade-review-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <BackLink
          id="btn-back-to-dashboard"
          onClick={() => navigate('/student/dashboard')}
          variant="wide"
        >
          ← Back to Dashboard
        </BackLink>
      </div>

      {/* Header Section */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          Grade Review Request
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Request a review of your course grade if you believe there may be an error
        </p>
      </header>

      {/* Information Banner (Light Blue) */}
      <div
        id="grade-review-info-banner"
        className="bg-[#F0F4FF] border border-[#BFDBFE] p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-[#1E40AF]"
      >
        <span className="text-lg shrink-0">ℹ️</span>
        <p className="font-medium leading-relaxed">
          You are requesting a grade review, not a specific grade change. An administrator will investigate and determine if any correction is needed.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Selection */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <div className="p-2 rounded-xl bg-[#D1FAE5] text-[#059669]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1F2937]">Select Course for Review</h2>
                <p className="text-[11px] text-[#6B7280]">Choose from completed course grades</p>
              </div>
            </div>

            {/* Course List */}
            <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-1">
              {coursesList.map((c) => {
                const isSelected = selectedCourse.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#059669] bg-[#F0FDF4] shadow-xs'
                        : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#059669]">
                          {c.code}
                        </span>
                        <h3 className="text-xs font-bold text-[#1F2937] mt-0.5">{c.name}</h3>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${c.gradeColor}`}
                      >
                        {c.grade}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-[#6B7280] pt-1 border-t border-dashed border-[#E5E7EB]">
                      <div>
                        <span className="text-[#9CA3AF]">Instructor:</span>{' '}
                        <span className="font-medium text-[#4B5563]">{c.instructor}</span>
                      </div>
                      <div>
                        <span className="text-[#9CA3AF]">Section:</span>{' '}
                        <span className="font-medium text-[#4B5563]">{c.section}</span>
                      </div>
                      <div>
                        <span className="text-[#9CA3AF]">Semester:</span>{' '}
                        <span className="font-medium text-[#4B5563]">{c.semester}</span>
                      </div>
                      <div>
                        <span className="text-[#9CA3AF]">Recorded:</span>{' '}
                        <span className="font-medium text-[#4B5563]">{c.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Grade Review Form */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1F2937]">Grade Review Request Form</h2>
                <p className="text-[11px] text-[#6B7280]">Provide clear documentation and reasons</p>
              </div>
            </div>

            {/* Selected Course Preview */}
            <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">
                  Selected Course for Review
                </span>
                <span className="font-mono text-xs font-bold text-[#059669]">
                  {selectedCourse.code} • {selectedCourse.section}
                </span>
                <p className="font-bold text-xs text-[#1F2937]">{selectedCourse.name}</p>
                <p className="text-[11px] text-[#6B7280]">
                  {selectedCourse.instructor} • {selectedCourse.semester}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-semibold text-[#6B7280]">Current Grade</span>
                <span
                  className={`px-3 py-1 rounded-xl text-base font-extrabold border ${selectedCourse.gradeColor}`}
                >
                  {selectedCourse.grade}
                </span>
              </div>
            </div>

            {/* Detailed Explanation Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937] flex items-center justify-between">
                <span>Detailed Explanation *</span>
                <span className="text-[11px] font-normal text-[#6B7280]">
                  Explain calculation discrepancy
                </span>
              </label>
              <textarea
                rows={4}
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why you believe there is a clerical or calculation error in your final grade..."
                className="w-full text-xs p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-hidden transition-all text-[#1F2937]"
              />
            </div>

            {/* Supporting Documents */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Supporting Documents (Optional)</label>
              <div className="p-3 border border-dashed border-[#D1D5DB] rounded-xl bg-[#F9FAFB] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#4B5563]">
                  <UploadCloud className="w-4 h-4 text-[#059669]" />
                  <span className="font-mono text-[11px] font-semibold">{uploadedFile}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile('[Midterm_Work_Graded.pdf]')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB] text-[11px] font-semibold text-[#4B5563] hover:bg-[#F3F4F6]"
                >
                  Change File
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-[#F3F4F6]">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#374151]">
                <input
                  type="checkbox"
                  checked={willingToMeet}
                  onChange={(e) => setWillingToMeet(e.target.checked)}
                  className="mt-0.5 rounded text-[#059669] focus:ring-[#059669] w-4 h-4"
                />
                <span>I am willing to meet with the instructor if required for verification.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#374151]">
                <input
                  type="checkbox"
                  checked={understandReviewOnly}
                  onChange={(e) => setUnderstandReviewOnly(e.target.checked)}
                  className="mt-0.5 rounded text-[#059669] focus:ring-[#059669] w-4 h-4"
                />
                <span>
                  I understand this is a request for review only and does not guarantee a grade change.
                </span>
              </label>
            </div>

            {/* Warning Banner */}
            <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-start gap-2.5 text-xs text-[#92400E]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
              <p className="leading-snug">
                <strong>Academic Notice:</strong> Frivolous grade review requests are discouraged. Reviews check for calculation and recording errors and may result in an unchanged, increased, or decreased grade.
              </p>
            </div>

            {/* Request Summary Box */}
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#6B7280] block">Course</span>
                <span className="font-bold text-[#1F2937]">{selectedCourse.code}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B7280] block">Current Grade</span>
                <span className="font-bold text-[#D97706]">{selectedCourse.grade}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B7280] block">Review Type</span>
                <span className="font-bold text-[#1F2937]">Final Audit</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6B7280] block">Documents Attached</span>
                <span className="font-bold text-[#059669]">1 PDF file</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!understandReviewOnly || !willingToMeet}
                className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-all"
              >
                Submit Grade Review Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
