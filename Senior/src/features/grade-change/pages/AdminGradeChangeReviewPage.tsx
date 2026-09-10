import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Scale,
  Clock,
  Send,
} from 'lucide-react';
import { studentInfo, courseDetails } from '../mocks/gradeChange.mock';
import { BackLink } from '../../../components/common/BackLink';

interface AdminGradeChangeReviewPageProps {
  onToast?: (msg: string) => void;
}

export const AdminGradeChangeReviewPage: React.FC<AdminGradeChangeReviewPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  // Route now carries :requestId (see router.tsx), but this page's
  // studentInfo/courseDetails mock data doesn't vary per request yet
  // (see features/grade-change/mocks/gradeChange.mock.ts) — same
  // pre-existing limitation noted in Phase 2/3, unrelated to bugs
  // #3/#4. The param is read for URL correctness, not yet consumed.
  useParams();
  const [decision, setDecision] = useState<'Approve' | 'Reject'>('Approve');
  const [proposedGrade, setProposedGrade] = useState<string>('B+');
  const [adminNotes, setAdminNotes] = useState<string>(
    'Verification completed with instructor [Dr. Tariq Al-Husseini]. Midterm exam score was erroneously keyed as 58% instead of 88% due to optical scanner misread on Scantron bubble sheet. Corrected final weighted grade translates to 84.5% ([B+]).'
  );

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onToast) {
      onToast(
        decision === 'Approve'
          ? `Grade change request #GR-2026-035 approved! Grade updated from [C+] to [${proposedGrade}].`
          : `Grade change request #GR-2026-035 has been rejected.`
      );
    }
    navigate('/admin/dashboard');
  };

  return (
    <div id="admin-grade-change-review-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <BackLink onClick={() => navigate('/admin/dashboard')} variant="wide">
          ← Back to Admin Dashboard
        </BackLink>
      </div>

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Grade Change
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#D1FAE5] text-[#059669] font-mono text-xs font-bold">
              Request #GR-2026-035
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">Submitted: [Feb 15, 2026] • Term: [Fall 2025]</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] inline-flex items-center gap-1.5 border border-[#F59E0B]/30">
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </span>
        </div>
      </header>

      {/* Notification Banner (Light Blue) */}
      <div className="bg-[#F0F4FF] border border-[#BFDBFE] p-4 rounded-2xl flex items-start sm:items-center gap-3 text-xs sm:text-sm text-[#1E40AF]">
        <div className="p-1.5 rounded-xl bg-white text-[#2563EB] shadow-xs shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <p className="font-medium">
          <strong>Strong → Grade Review Request:</strong> Instructor verification form and scanned assessment rubric have been attached by department secretary.
        </p>
      </div>

      {/* Grid: 3 columns or 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Student & Request Details) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Student Information Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F3F4F6]">
              <div className="w-12 h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                MA
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1F2937]">{studentInfo.name}</h3>
                <span className="font-mono text-xs font-semibold text-[#059669]">
                  {studentInfo.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider block">
                  Current GPA
                </span>
                <span className="font-extrabold text-[#1F2937] text-sm">{studentInfo.gpa}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider block">
                  Completed Credits
                </span>
                <span className="font-extrabold text-[#1F2937] text-sm">{studentInfo.credits}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider block">
                  Academic Standing
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[11px] font-bold inline-block mt-0.5">
                  {studentInfo.standing}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider block">
                  Major
                </span>
                <span className="font-semibold text-[#4B5563] text-[11px] block truncate">
                  {studentInfo.program}
                </span>
              </div>
            </div>
          </div>

          {/* Request Details Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3 text-xs">
            <h3 className="font-bold text-xs text-[#1F2937] pb-2 border-b border-[#F3F4F6]">
              Course Information
            </h3>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Course Code:</span>
              <span className="font-mono font-bold text-[#059669]">{courseDetails.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Course Name:</span>
              <span className="font-semibold text-[#1F2937] text-right">{courseDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Instructor:</span>
              <span className="font-medium text-[#4B5563]">{courseDetails.instructor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Section / Term:</span>
              <span className="font-medium text-[#4B5563]">
                {courseDetails.section} • {courseDetails.semester}
              </span>
            </div>
          </div>

          {/* Current Grade Display Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#6B7280] tracking-wider">
                Current Recorded Grade
              </span>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Reported on Banner SIS</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#D97706] font-extrabold text-2xl flex items-center justify-center shadow-xs">
              {courseDetails.finalGrade}
            </div>
          </div>
        </div>

        {/* Right Column (Reason, Grade Investigation, and Decision) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Student's Reason Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-2">
            <h3 className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#059669]" />
              <span>Student's Justification & Reason</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#374151] leading-relaxed italic">
              "I believe there may be a calculation discrepancy on my final exam score and assignment weightings. My midterm exam was [88%] and coursework average was [91%], but the final reported grade is [C+]. I kindly request a clerical verification of the final assessment grade breakdown."
            </div>
          </div>

          {/*
            PLACEHOLDER — FUTURE SOURCE TBD
            This audit table (original vs. corrected scores) and the GPA
            impact projection in the decision form below are plausible
            candidates for the Grade Change Academic Eligibility
            Evaluation / Case Summary Agent, but this is NOT confirmed —
            it could equally be a deterministic backend recalculation.
            Do not assume AI agent output until confirmed with the
            domain/agent design.
            TODO: Confirm the intended source of this audit data.
          */}
          {/* Grade Investigation Card (Original calculation vs Corrected calculation) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <h3 className="font-bold text-xs text-[#1F2937] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#0284C7]" />
                <span>Grade Investigation Audit</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669]">
                Discrepancy Confirmed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F9FAFB] text-[#6B7280] text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Assessment Item</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Original Recorded</th>
                    <th className="py-2.5 px-3">Audited Score</th>
                    <th className="py-2.5 px-3">Audit Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">Midterm Exam</td>
                    <td className="py-2.5 px-3 text-[#6B7280]">25%</td>
                    <td className="py-2.5 px-3 font-mono text-[#EF4444] font-bold">58 / 100</td>
                    <td className="py-2.5 px-3 font-mono text-[#059669] font-bold">88 / 100</td>
                    <td className="py-2.5 px-3 text-[11px] text-[#4B5563]">Scantron misalignment corrected</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">Coursework & Labs</td>
                    <td className="py-2.5 px-3 text-[#6B7280]">25%</td>
                    <td className="py-2.5 px-3 font-mono text-[#1F2937]">91 / 100</td>
                    <td className="py-2.5 px-3 font-mono text-[#1F2937]">91 / 100</td>
                    <td className="py-2.5 px-3 text-[11px] text-[#4B5563]">Matches Gradebook</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#1F2937]">Final Examination</td>
                    <td className="py-2.5 px-3 text-[#6B7280]">50%</td>
                    <td className="py-2.5 px-3 font-mono text-[#1F2937]">79 / 100</td>
                    <td className="py-2.5 px-3 font-mono text-[#1F2937]">79 / 100</td>
                    <td className="py-2.5 px-3 text-[11px] text-[#4B5563]">Verified booklet paper</td>
                  </tr>
                  <tr className="bg-[#F0FDF4] font-bold">
                    <td className="py-2.5 px-3 text-[#059669]">Total Calculated Grade</td>
                    <td className="py-2.5 px-3 text-[#059669]">100%</td>
                    <td className="py-2.5 px-3 text-[#EF4444] font-mono text-sm">76.8% ([C+])</td>
                    <td className="py-2.5 px-3 text-[#059669] font-mono text-sm">84.3% ([B+])</td>
                    <td className="py-2.5 px-3 text-[#059669] text-xs">+7.5% Discrepancy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Decision Section */}
          <form
            onSubmit={handleDecisionSubmit}
            className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4"
          >
            <h3 className="font-bold text-xs text-[#1F2937] pb-2 border-b border-[#F3F4F6]">
              Committee & Registrar Decision
            </h3>

            {/* GPA Impact Warning */}
            <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-start gap-2.5 text-xs text-[#92400E]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
              <p className="leading-snug">
                <strong>GPA Impact Notice:</strong> Modifying this grade will recalibrate the student's cumulative GPA from [3.62] to [3.66] across [84] completed credit hours.
              </p>
            </div>

            {/* Decision Radio / Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approve')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  decision === 'Approve'
                    ? 'border-[#059669] bg-[#D1FAE5] text-[#059669] shadow-xs'
                    : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Grade Change</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('Reject')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  decision === 'Reject'
                    ? 'border-[#EF4444] bg-[#FEE2E2] text-[#EF4444] shadow-xs'
                    : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Grade Change</span>
              </button>
            </div>

            {/* Grade Modification Box */}
            {decision === 'Approve' && (
              <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[#065F46] font-semibold">Grade Modification:</span>
                  <div className="flex items-center gap-2 font-mono font-extrabold text-sm">
                    <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#D97706] rounded-lg border border-[#F59E0B]/30">
                      [C+]
                    </span>
                    <span className="text-[#059669]">→</span>
                    <span className="px-2.5 py-1 bg-[#D1FAE5] text-[#059669] rounded-lg border border-[#059669]/30">
                      [{proposedGrade}]
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-[#065F46]">New Grade:</label>
                  <select
                    value={proposedGrade}
                    onChange={(e) => setProposedGrade(e.target.value)}
                    className="p-1.5 rounded-lg border border-[#A7F3D0] bg-white text-xs font-bold text-[#059669] outline-hidden focus:ring-1 focus:ring-[#059669]"
                  >
                    <option value="A">A (4.0)</option>
                    <option value="A-">A- (3.7)</option>
                    <option value="B+">B+ (3.3)</option>
                    <option value="B">B (3.0)</option>
                    <option value="B-">B- (2.7)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Administrator & Registrar Notes *</label>
              <textarea
                rows={3}
                required
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter official rationale for transcript audit records..."
                className="w-full text-xs p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-hidden text-[#1F2937]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 ${
                  decision === 'Approve'
                    ? 'bg-[#059669] hover:bg-[#047857]'
                    : 'bg-[#EF4444] hover:bg-[#DC2626]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{decision === 'Approve' ? 'Approve Grade Change' : 'Confirm Grade Rejection'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
