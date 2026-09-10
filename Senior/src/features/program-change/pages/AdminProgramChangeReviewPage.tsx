import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
  Send,
  BookOpen,
} from 'lucide-react';
import { studentData, committeeList } from '../mocks/programChange.mock';
import { BackLink } from '../../../components/common/BackLink';

interface AdminProgramChangeReviewPageProps {
  onToast?: (msg: string) => void;
}

export const AdminProgramChangeReviewPage: React.FC<AdminProgramChangeReviewPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  // Route now carries :requestId (see router.tsx), but this page's
  // studentData/committeeList mock data doesn't vary per request yet
  // — same pre-existing limitation noted in Phase 2/3, unrelated to
  // bugs #3/#4. The param is read for URL correctness, not consumed.
  useParams();
  const [myVote, setMyVote] = useState<'Approve' | 'Reject' | 'Abstain'>('Approve');
  const [comment, setComment] = useState<string>(
    'Student meets all prerequisite mathematics and core algorithms benchmarks with high distinction (GPA: [3.62]). Credits map effectively into the AI/Data Science study plan with zero credit loss.'
  );

  const handleVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onToast) {
      onToast(`Your vote (${myVote}) for Program Change Request #PC-2026-088 has been submitted.`);
    }
    navigate('/admin/dashboard');
  };

  return (
    <div id="admin-program-change-review-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
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
              Program Change Request
            </h1>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#F3E8FF] text-[#9333EA] font-mono text-xs font-bold">
              [#PC-2026-088]
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Submitted: [Feb 18, 2026] • From: <strong className="text-[#1F2937]">CS</strong> →{' '}
            <strong className="text-[#059669]">Data Science</strong>
          </p>
        </div>

        <div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#9333EA] inline-flex items-center gap-1.5 border border-[#9333EA]/30">
            <Users className="w-3.5 h-3.5" />
            <span>Committee Review</span>
          </span>
        </div>
      </header>

      {/* Notification Banner (Light Purple) */}
      <div className="bg-[#F3E8FF] border border-[#E9D5FF] p-4 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm text-[#7E22CE]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-xl bg-white text-[#9333EA] shadow-xs shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-medium">
            <strong>Committee Review Required:</strong> Quorum requires 3 affirmative votes from departmental representatives.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-white/80 text-[#7E22CE] font-bold text-xs shrink-0">
          2 of 5 votes cast
        </span>
      </div>

      {/* Student Profile Card */}
      <section className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#059669] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            MA
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#1F2937]">{studentData.name}</h2>
            <span className="font-mono text-xs text-[#059669] font-bold">{studentData.id}</span>
            <p className="text-xs text-[#6B7280]">
              {studentData.currentProgram} • {studentData.year}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 border-t sm:border-t-0 sm:border-l border-[#F3F4F6] pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
          <div>
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
              Cumulative GPA
            </span>
            <span className="text-base font-extrabold text-[#1F2937]">{studentData.gpa}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
              Earned Credits
            </span>
            <span className="text-base font-extrabold text-[#1F2937]">{studentData.credits}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
              Standing
            </span>
            <span className="text-xs font-bold text-[#059669] block mt-0.5">Good Standing</span>
          </div>
        </div>
      </section>

      {/* Program Comparison & Requirements Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Program Box (Light Blue Border) */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#BFDBFE] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1D4ED8] uppercase tracking-wider">
              Current Academic Program
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1E40AF] text-[11px] font-bold">
              Enrolled
            </span>
          </div>
          <h3 className="text-base font-extrabold text-[#1F2937]">B.Sc. Computer Science</h3>
          <p className="text-xs text-[#6B7280]">
            College of Computing and Informatics • 120 Total Credits (84 Completed)
          </p>
        </div>

        {/* Requested Program Box (Light Green Border) */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#A7F3D0] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">
              Requested Target Program
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[11px] font-bold">
              Target Program
            </span>
          </div>
          <h3 className="text-base font-extrabold text-[#1F2937]">
            B.Sc. Data Science & Artificial Intelligence
          </h3>
          <p className="text-xs text-[#6B7280]">
            College of Computing and Informatics • 120 Total Credits (84 Transferable)
          </p>
        </div>
      </div>

      {/*
        PLACEHOLDER — FUTURE SOURCE TBD
        The requirements-check card below and the "Study Plan
        Equivalency Mapping" table further down are plausible
        candidates for the Program Change Academic Eligibility
        Evaluation Agent, but this is NOT confirmed. Do not assume AI
        agent output until confirmed with the domain/agent design —
        this could also be a deterministic backend calculation.
        TODO: Confirm the intended source of this eligibility/mapping data.
      */}
      {/* Requirements Check Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
          <div>
            <span className="font-bold text-[#065F46] block">Minimum GPA Met</span>
            <span className="text-[11px] text-[#047857]">Requires 2.50 • Student has 3.62</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
          <div>
            <span className="font-bold text-[#065F46] block">Credit Hours Benchmark</span>
            <span className="text-[11px] text-[#047857]">Requires ≥ 30 credits • Has 84</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F0F4FF] border border-[#BFDBFE] flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#2563EB] shrink-0" />
          <div>
            <span className="font-bold text-[#1E40AF] block">Advisor Recommendation</span>
            <span className="text-[11px] text-[#1D4ED8]">Strongly Recommended by Advisor</span>
          </div>
        </div>
      </div>

      {/* Study Plan Course-by-Course Comparison Across Semesters */}
      <section className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3">
        <h3 className="font-bold text-xs text-[#1F2937] flex items-center gap-2 pb-2 border-b border-[#F3F4F6]">
          <BookOpen className="w-4 h-4 text-[#059669]" />
          <span>Study Plan Equivalency Mapping</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Completed Course in CS</th>
                <th className="py-2.5 px-3">Grade</th>
                <th className="py-2.5 px-3">Direct Mapping in Data Science</th>
                <th className="py-2.5 px-3">Credits</th>
                <th className="py-2.5 px-3">Transfer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1F2937]">[CS-101] Programming I</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#059669]">[A]</td>
                <td className="py-2.5 px-3 text-[#4B5563]">[DS-101] Programming for Data Science</td>
                <td className="py-2.5 px-3 font-mono">3</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[10px] font-bold">
                    Equivalent ✓
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1F2937]">[CS-202] Data Structures</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#059669]">[B+]</td>
                <td className="py-2.5 px-3 text-[#4B5563]">[DS-202] Advanced Data Structures</td>
                <td className="py-2.5 px-3 font-mono">3</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[10px] font-bold">
                    Equivalent ✓
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1F2937]">[MATH-201] Linear Algebra</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#059669]">[A-]</td>
                <td className="py-2.5 px-3 text-[#4B5563]">[MATH-201] Linear Algebra</td>
                <td className="py-2.5 px-3 font-mono">3</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[10px] font-bold">
                    Direct Match ✓
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1F2937]">[CS-301] Database Systems</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#059669]">[B+]</td>
                <td className="py-2.5 px-3 text-[#4B5563]">[DS-301] Big Data & Databases</td>
                <td className="py-2.5 px-3 font-mono">3</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] text-[10px] font-bold">
                    Equivalent ✓
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Committee Members & Voting Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Committee Members List: 5 Cols */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
            <h3 className="font-bold text-xs text-[#1F2937] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#9333EA]" />
              <span>Committee Members ({committeeList.length})</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669]">
              2 Approved
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {committeeList.map((member, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] flex flex-col gap-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2937]">{member.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      member.status === 'Approved'
                        ? 'bg-[#D1FAE5] text-[#059669]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>
                <span className="text-[11px] text-[#6B7280]">{member.role}</span>
                {member.comment && (
                  <p className="text-[11px] text-[#4B5563] italic pt-1 border-t border-[#E5E7EB]">
                    "{member.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Voting Form: 7 Cols */}
        <form
          onSubmit={handleVoteSubmit}
          className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
            <h3 className="font-bold text-xs text-[#1F2937]">Cast Your Committee Vote</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#059669] font-bold">2 Approved</span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="text-[#EF4444] font-bold">0 Rejected</span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="text-[#D97706] font-bold">3 Pending</span>
            </div>
          </div>

          {/* Cast Vote 3 Options */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setMyVote('Approve')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                myVote === 'Approve'
                  ? 'border-[#059669] bg-[#D1FAE5] text-[#059669] shadow-xs'
                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve</span>
            </button>

            <button
              type="button"
              onClick={() => setMyVote('Reject')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                myVote === 'Reject'
                  ? 'border-[#EF4444] bg-[#FEE2E2] text-[#EF4444] shadow-xs'
                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              onClick={() => setMyVote('Abstain')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                myVote === 'Abstain'
                  ? 'border-[#6B7280] bg-[#F3F4F6] text-[#1F2937] shadow-xs'
                  : 'border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]'
              }`}
            >
              <span>Abstain</span>
            </button>
          </div>

          {/* Comments Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1F2937]">Committee Evaluation Comments *</label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide academic remarks on student transcript mapping and readiness..."
              className="w-full text-xs p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-hidden text-[#1F2937]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onToast) onToast('Requested additional documentation from academic advisor.');
              }}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
            >
              Request More Info
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit My Vote</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
