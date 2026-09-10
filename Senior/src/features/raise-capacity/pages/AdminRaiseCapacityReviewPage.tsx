import React, { useState } from 'react';
import {
  Clock,
  BookOpen,
  GraduationCap,
  FileSpreadsheet,
  Info,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { defaultStudentProfile } from '../../../mocks/students.mock';
import { studentTranscriptSample } from '../../../mocks/transcripts.mock';
import { sampleAdminRequests } from '../../../mocks/requests.mock';
import { fromRequestSlug } from '../../../app/routeHelpers';
import { BackLink } from '../../../components/common/BackLink';
import { ApproveRejectCards } from '../../../components/common/ApproveRejectCards';

interface AdminRaiseCapacityReviewPageProps {
  onToast: (msg: string) => void;
}

/**
 * BUG #4 FIX
 *
 * Previously this page accepted a `requestData?: any` prop that
 * carried two incompatible shapes depending on which page navigated
 * here (a full AcademicRequest from AdminDashboard, or a bare
 * course-roster row from AdminCourseDetailsPage), which caused wrong
 * student details and a student ID being displayed as a Request ID.
 *
 * Fixed by making the URL's `:requestId` param the single source of
 * identity: this page looks up the real AcademicRequest from mock
 * data by ID. When the param is missing or doesn't match a real
 * request (e.g. reached via AdminCourseDetailsPage for a student with
 * no matching raise-capacity request — see that file's
 * `resolveReviewPath`), it falls back to the same generic default
 * profile this page already used to show — honest about not having
 * real data, rather than showing another record's mismatched details.
 */
export const AdminRaiseCapacityReviewPage: React.FC<AdminRaiseCapacityReviewPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  const { requestId: requestIdParam } = useParams();
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState<string>(
    'Approved based on graduation prerequisite status and good academic standing.'
  );
  const [totalSeats, setTotalSeats] = useState<number>(35);
  const [effectiveSemester, setEffectiveSemester] = useState<string>('Spring 2026');

  const matchedRequest = requestIdParam
    ? sampleAdminRequests.find(
        (r) => r.type === 'Raise Capacity' && r.id === fromRequestSlug(requestIdParam)
      )
    : undefined;

  const studentName = matchedRequest?.studentName || defaultStudentProfile.name;
  const studentId = matchedRequest?.studentId || defaultStudentProfile.id;
  const requestId = matchedRequest?.id || '#RC-2026-088';

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onToast(
      decision === 'approve'
        ? `Request ${requestId} Approved! Capacity increased to ${totalSeats} seats.`
        : `Request ${requestId} Rejected. Student notified.`
    );
    navigate('/admin/requests/raise-capacity');
  };

  return (
    <div id="admin-raise-capacity-review-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Navigation Back */}
      <div>
        <BackLink onClick={() => navigate('/admin/requests/raise-capacity')} variant="tight">
          Back to Raise Capacity List
        </BackLink>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                Raise Capacity Request
              </h1>
              <span className="font-mono font-bold text-sm text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-lg">
                {requestId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-1 flex-wrap">
              <span>Submitted: <strong className="text-[#1F2937]">Mar 15, 2026</strong></span>
              <span>•</span>
              <span>Priority: <strong className="text-[#EF4444]">High Priority</strong></span>
              <span>•</span>
              <span>Department: <strong className="text-[#1F2937]">Computer Science</strong></span>
            </div>
          </div>

          <div>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FEF3C7] text-[#D97706] inline-flex items-center gap-1.5 border border-[#F59E0B]/30">
              <Clock className="w-4 h-4" />
              Pending Review
            </span>
          </div>
        </div>
      </div>

      {/*
        PLACEHOLDER AGENT OUTPUT
        This urgency banner (and the "High Urgency" badge below) is a
        reasonable candidate for the Raise Capacity Request
        Prioritization Agent's output, per the planned agent list.
        TODO: Replace with the result returned by that agent through
        the FastAPI backend. Left as static markup for now — not moved
        to a mock file since it is not a standalone data value.
      */}
      <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-between gap-3 text-xs text-[#0369A1]">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[#0284C7] shrink-0" />
          <div>
            <p className="font-bold text-[#0C4A6E]">New Request Notification</p>
            <p className="text-[11px] text-[#0369A1] mt-0.5">
              This student is scheduled for graduation in Spring 2027 and requires this course prerequisite.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-[#0284C7] shadow-xs">
          High Urgency
        </span>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Information & Transcript (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Student Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <GraduationCap className="w-4 h-4 text-[#059669]" />
              <h2 className="font-bold text-sm text-[#1F2937]">Student Profile</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#059669] text-white font-bold text-base flex items-center justify-center shadow-sm">
                {defaultStudentProfile.initials}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1F2937]">{studentName}</h3>
                <p className="text-xs text-[#6B7280] font-mono">ID: {studentId}</p>
                <p className="text-[11px] text-[#6B7280]">{defaultStudentProfile.program}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB]/60">
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Cumulative GPA</span>
                <span className="font-bold text-[#059669] text-sm">{defaultStudentProfile.gpa}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Completed Credits</span>
                <span className="font-bold text-[#1F2937] text-sm">{defaultStudentProfile.credits} hrs</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Academic Standing</span>
                <span className="font-bold text-[#059669]">{defaultStudentProfile.standing}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Academic Year</span>
                <span className="font-semibold text-[#1F2937]">{defaultStudentProfile.year}</span>
              </div>
            </div>
          </div>

          {/* Transcript Records Table */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
                <h3 className="font-bold text-xs text-[#1F2937]">Transcript Records</h3>
              </div>
              <span className="text-[10px] text-[#059669] font-semibold">Verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[#6B7280] text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2 px-2.5">Course</th>
                    <th className="py-2 px-2.5">Grade</th>
                    <th className="py-2 px-2.5">Credits</th>
                    <th className="py-2 px-2.5">Term</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {studentTranscriptSample.map((t, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-2.5">
                        <span className="font-mono font-semibold text-[#1F2937]">{t.code}</span>
                        <span className="block text-[10px] text-[#6B7280]">{t.title}</span>
                      </td>
                      <td className="py-2 px-2.5 font-bold text-[#059669]">{t.grade}</td>
                      <td className="py-2 px-2.5 text-[#6B7280]">{t.credits}</td>
                      <td className="py-2 px-2.5 text-[#6B7280] text-[11px]">{t.term}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Course & Request Details & Decision (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Course Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <BookOpen className="w-4 h-4 text-[#059669]" />
              <h2 className="font-bold text-sm text-[#1F2937]">Course & Request Details</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]/60 text-xs">
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Course Code</span>
                <span className="font-mono font-bold text-[#059669]">1501263</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Course Name</span>
                <span className="font-semibold text-[#1F2937]">Programming I (Sec 31)</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Current Capacity</span>
                <span className="font-bold text-[#EF4444]">32/30 (106%)</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Waitlist Queue</span>
                <span className="font-bold text-[#D97706]">5 students</span>
              </div>
            </div>

            {/* Student Justification Text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Student Statement & Justification
              </label>
              <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#374151] leading-relaxed italic">
                "I need this course to meet graduation prerequisites for next semester. There are no alternative open sections compatible with my graduation degree plan, and this course is mandatory for senior project registration."
              </div>
            </div>
          </div>

          {/* Decision Section Form */}
          <form
            onSubmit={handleDecisionSubmit}
            className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-sm text-[#1F2937]">Administrative Decision</h2>
              <span className="text-xs text-[#6B7280]">HOD Department Authority</span>
            </div>

            {/* Decision Radio Buttons */}
            <ApproveRejectCards
              name="admin-decision"
              decision={decision}
              onChange={setDecision}
              approveTitle="Approve Request"
              approveDescription="Authorize seat override in Banner"
              rejectTitle="Reject Request"
              rejectDescription="Decline due to lab room limit"
            />

            {/* Adjustment Fields when Approved */}
            {decision === 'approve' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    New Total Section Seats
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={50}
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs font-bold text-[#1F2937]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    Effective Academic Term
                  </label>
                  <select
                    value={effectiveSemester}
                    onChange={(e) => setEffectiveSemester(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs font-semibold text-[#1F2937]"
                  >
                    <option value="Spring 2026">Spring 2026</option>
                    <option value="Summer 2026">Summer 2026</option>
                  </select>
                </div>
              </div>
            )}

            {/* Decision Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Official Committee / HOD Remarks
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter remarks logged in student academic record..."
                className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/requests/raise-capacity')}
                className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all ${
                  decision === 'approve'
                    ? 'bg-[#059669] hover:bg-[#047857]'
                    : 'bg-[#EF4444] hover:bg-[#DC2626]'
                }`}
              >
                Submit Decision
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
