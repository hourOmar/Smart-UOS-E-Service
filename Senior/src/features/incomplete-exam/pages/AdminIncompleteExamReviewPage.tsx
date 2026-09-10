import React, { useState } from 'react';
import {
  Clock,
  FileText,
  Download,
  GraduationCap,
  BookOpen,
  Info,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { defaultStudentProfile } from '../../../mocks/students.mock';
import { sampleAdminRequests } from '../../../mocks/requests.mock';
import { fromRequestSlug } from '../../../app/routeHelpers';
import { BackLink } from '../../../components/common/BackLink';
import { ApproveRejectCards } from '../../../components/common/ApproveRejectCards';

interface AdminIncompleteExamReviewPageProps {
  onToast: (msg: string) => void;
}

export const AdminIncompleteExamReviewPage: React.FC<AdminIncompleteExamReviewPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  // Route param now carries request identity instead of an object
  // prop — consistent with the bug #4 fix in the Raise Capacity
  // review page (see AdminRaiseCapacityReviewPage.tsx). This page's
  // only navigation source (AdminDashboard.tsx) always has a real
  // AcademicRequest, so there's no incompatible-shape issue here to
  // resolve — this change is purely part of the general PageId removal.
  const { requestId: requestIdParam } = useParams();
  const matchedRequest = requestIdParam
    ? sampleAdminRequests.find(
        (r) => r.type === 'Incomplete Exam' && r.id === fromRequestSlug(requestIdParam)
      )
    : undefined;
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-24');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [examRoom, setExamRoom] = useState<string>('Hall M9-204');
  const [proctor, setProctor] = useState<string>('Dr. Tariq Saeed');
  const [notes, setNotes] = useState<string>(
    'Medical certificate verified by University Clinic. Make-up exam approved for the proposed primary schedule.'
  );

  const studentName = matchedRequest?.studentName || defaultStudentProfile.name;
  const studentId = matchedRequest?.studentId || defaultStudentProfile.id;
  const requestId = matchedRequest?.id || '#IE-2026-042';

  const handleSubmitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    onToast(
      decision === 'approve'
        ? `Incomplete Exam ${requestId} Approved! Scheduled for ${selectedDate} at ${examRoom}.`
        : `Incomplete Exam ${requestId} Rejected. Student notified.`
    );
    navigate('/admin/dashboard');
  };

  return (
    <div id="admin-incomplete-exam-review-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Breadcrumb & Status */}
      <div>
        <BackLink onClick={() => navigate('/admin/dashboard')} variant="tight">
          Back to Admin Dashboard
        </BackLink>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
                Incomplete Exam Request
              </h1>
              <span className="font-mono font-bold text-sm text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded-lg">
                {requestId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-1 flex-wrap">
              <span>Submitted: <strong className="text-[#1F2937]">Mar 14, 2026</strong></span>
              <span>•</span>
              <span>Priority: <strong className="text-[#EF4444]">High Priority</strong></span>
              <span>•</span>
              <span>Department: <strong className="text-[#1F2937]">Mathematics</strong></span>
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
        PLACEHOLDER — FUTURE SOURCE TBD
        The "High Urgency"/medical-case badge and banner below are NOT
        confirmed to be AI agent output — Incomplete Exam only has an
        Academic Eligibility Evaluation Agent and a Rejection
        Explanation Agent listed in the planned agent design, no
        prioritization agent. Do not assume this maps to an agent
        until confirmed with the domain/agent design.
        TODO: Confirm the intended source of this urgency indicator.
      */}
      <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-between gap-3 text-xs text-[#0369A1]">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[#0284C7] shrink-0" />
          <div>
            <p className="font-bold text-[#0C4A6E]">Emergency Incomplete Examination Review</p>
            <p className="text-[11px] text-[#0369A1] mt-0.5">
              Official medical documentation attached and validated with University Hospital Sharjah records.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-bold text-[#0284C7] shadow-xs">
          Medical Case
        </span>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student & Course Information (5 cols) */}
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
                <span className="text-[#9CA3AF] text-[10px] block">Standing</span>
                <span className="font-bold text-[#059669]">{defaultStudentProfile.standing}</span>
              </div>
            </div>
          </div>

          {/* Course Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <BookOpen className="w-4 h-4 text-[#059669]" />
              <h2 className="font-bold text-sm text-[#1F2937]">Course Exam Details</h2>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Course Name:</span>
                <span className="font-bold text-[#1F2937]">Calculus I</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Course Code:</span>
                <span className="font-mono font-bold text-[#059669]">1402101</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Instructor:</span>
                <span className="font-semibold text-[#1F2937]">Dr. Tariq Saeed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Current Grade Standing:</span>
                <span className="font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
                  68% (D+)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Original Exam Date:</span>
                <span className="font-semibold text-[#EF4444]">Mar 12, 2026 (Missed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Request Details & Decision (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Petition Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-sm text-[#1F2937]">Petition Details & Proof</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#EF4444]">
                Medical Emergency
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#1F2937]">Student Statement</label>
              <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#374151] leading-relaxed italic">
                "I experienced severe acute viral gastroenteritis requiring intravenous emergency care and hospitalization at University Hospital Sharjah on the day of the exam. Medical certificate and discharge summary are attached."
              </div>
            </div>

            {/* Medical Attachment Card */}
            <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#059669]" />
                <div>
                  <span className="text-xs font-bold text-[#166534] block">
                    Hospital_Medical_Discharge_Summary.pdf
                  </span>
                  <span className="text-[10px] text-[#059669]">2.4 MB • Stamped by Dr. Al Qasimi</span>
                </div>
              </div>
              <button
                onClick={() => onToast('Medical discharge PDF downloaded.')}
                className="p-2 rounded-lg bg-white text-[#059669] hover:bg-[#059669] hover:text-white transition-all shadow-xs"
                aria-label="Download attachment"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Proposed Dates Summary */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB]/60">
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Primary Make-up Date:</span>
                <span className="font-bold text-[#1F2937]">Mar 24, 2026 at 10:00 AM</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Alternative Date:</span>
                <span className="font-semibold text-[#6B7280]">Mar 26, 2026 at 02:00 PM</span>
              </div>
            </div>
          </div>

          {/* Decision Card Form */}
          <form
            onSubmit={handleSubmitDecision}
            className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-sm text-[#1F2937]">Committee Decision & Scheduling</h2>
              <span className="text-xs text-[#6B7280]">Exam Board Action</span>
            </div>

            {/* Radio Decision */}
            <ApproveRejectCards
              name="exam-decision"
              decision={decision}
              onChange={setDecision}
              approveTitle="Approve Incomplete Exam"
              approveDescription="Assign proctor and exam hall"
              rejectTitle="Reject Petition"
              rejectDescription="Insufficient valid documentation"
            />

            {/* Approved Scheduling Fields */}
            {decision === 'approve' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">Approved Exam Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs font-bold text-[#1F2937]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">Exam Time Slot</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs font-semibold text-[#1F2937]"
                  >
                    <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">Examination Hall</label>
                  <input
                    type="text"
                    value={examRoom}
                    onChange={(e) => setExamRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs font-bold text-[#1F2937]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#166534] block mb-1">Assigned Proctor</label>
                  <input
                    type="text"
                    value={proctor}
                    onChange={(e) => setProctor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#BBF7D0] rounded-xl text-xs font-bold text-[#1F2937]"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">Board Remarks</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter remarks logged in official exam records..."
                className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#059669]/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
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
