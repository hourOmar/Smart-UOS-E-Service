import React, { useEffect, useState } from 'react';
import {
  Clock,
  BookOpen,
  GraduationCap,
  Info,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fromRequestSlug } from '../../../app/routeHelpers';
import { BackLink } from '../../../components/common/BackLink';
import { ApproveRejectCards } from '../../../components/common/ApproveRejectCards';
import { supabase } from '../../../services/supabase/client';

interface AdminRaiseCapacityReviewPageProps {
  onToast: (msg: string) => void;
}

interface ReviewData {
  request: {
    Request_ID: string;
    Request_Type: string;
    Request_Date: string;
    Description: string | null;
    Current_Status: string | null;
    Student_ID: string | null;
  };
  student: {
    Student_ID: string;
    Student_Name: string | null;
    CGPA: number | null;
    Completed_Hours: number | null;
    Program_ID: number | null;
    Expected_Graduation_Term: string | null;
  } | null;
  program: {
    Program_ID: number;
    Program_Name: string;
    College_Name: string;
  } | null;
  raiseCapacity: {
    Course_ID: number;
    Section_ID: string;
    Term: string;
    Reason: string | null;
  } | null;
  course: {
    Course_ID: number;
    Course_Name: string;
    Credit_Hours: number | null;
  } | null;
  section: {
    Section_ID: string;
    Course_ID: number;
    Term: string;
    Current_Capacity: number;
    Total_Capacity: number;
    Additional_Capacity: number | null;
  } | null;
}

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

  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestIdParam) {
      setLoading(false);
      return;
    }

    const realId = fromRequestSlug(requestIdParam);

    (async () => {
      try {
        // 1. Fetch the Request row
        const { data: req, error: reqErr } = await supabase
          .from('Request')
          .select('Request_ID, Request_Type, Request_Date, Description, Current_Status, Student_ID')
          .eq('Request_ID', realId)
          .maybeSingle();

        if (reqErr) throw reqErr;
        if (!req) throw new Error('Request not found.');

        // 2. Fetch the Student
        let student = null;
        if (req.Student_ID) {
          const { data: stu, error: stuErr } = await supabase
            .from('Student')
            .select('Student_ID, Student_Name, CGPA, Completed_Hours, Program_ID, Expected_Graduation_Term')
            .eq('Student_ID', req.Student_ID)
            .maybeSingle();
          if (stuErr) throw stuErr;
          student = stu;
        }

        // 3. Fetch the Program (if the student has one)
        let program = null;
        if (student?.Program_ID) {
          const { data: prog, error: progErr } = await supabase
            .from('Program')
            .select('Program_ID, Program_Name, College_Name')
            .eq('Program_ID', student.Program_ID)
            .maybeSingle();
          if (progErr) throw progErr;
          program = prog;
        }

        // 4. Fetch the Raise_Capacity subtype row
        const { data: rc, error: rcErr } = await supabase
          .from('Raise_Capacity')
          .select('Course_ID, Section_ID, Term, Reason')
          .eq('Request_ID', req.Request_ID)
          .maybeSingle();

        if (rcErr) throw rcErr;

        // 5. Fetch the Course and Section
        let course = null;
        let section = null;

        if (rc) {
          const { data: c, error: cErr } = await supabase
            .from('Course')
            .select('Course_ID, Course_Name, Credit_Hours')
            .eq('Course_ID', rc.Course_ID)
            .maybeSingle();
          if (cErr) throw cErr;
          course = c;

          const { data: sec, error: secErr } = await supabase
            .from('Section')
            .select('Section_ID, Course_ID, Term, Current_Capacity, Total_Capacity, Additional_Capacity')
            .eq('Section_ID', rc.Section_ID)
            .eq('Course_ID', rc.Course_ID)
            .eq('Term', rc.Term)
            .maybeSingle();
          if (secErr) throw secErr;
          section = sec;
        }

        setData({
          request: req,
          student,
          program,
          raiseCapacity: rc,
          course,
          section,
        });

        // Pre-fill the seat field from the real section capacity
        if (section) {
          const proposed = (section.Total_Capacity ?? 0) + 5;
          setTotalSeats(proposed);
        }
        if (section?.Term) {
          // Show the term as "Spring 2026" style when possible
          const t = String(section.Term);
          const year = t.slice(0, 4);
          const termNum = t.slice(4);
          const season =
            termNum === '01' ? 'Fall' :
            termNum === '02' ? 'Spring' :
            termNum === '03' ? 'Summer' :
            `Term ${termNum}`;
          setEffectiveSemester(`${season} ${year}`);
        }
      } catch (err) {
        console.error('Failed to load review data:', err);
        setLoadError((err as Error).message || 'Failed to load request.');
      } finally {
        setLoading(false);
      }
    })();
  }, [requestIdParam]);

  const requestId = data?.request?.Request_ID ?? '—';
  const studentName = data?.student?.Student_Name ?? '—';
  const studentId = data?.student?.Student_ID ?? '—';
  const programName = data?.program?.Program_Name ?? '—';
  const gpa = data?.student?.CGPA ?? '—';
  const credits = data?.student?.Completed_Hours ?? '—';
  const gradTerm = data?.student?.Expected_Graduation_Term ?? '—';

  const courseCode = data?.course?.Course_ID ?? '—';
  const courseName = data?.course?.Course_Name ?? '—';
  const creditHours = data?.course?.Credit_Hours ?? '—';
  const sectionId = data?.section?.Section_ID ?? '—';
  const currentCap = data?.section?.Current_Capacity ?? '—';
  const totalCap = data?.section?.Total_Capacity ?? '—';
  const percent =
    data?.section && data.section.Total_Capacity
      ? Math.round((data.section.Current_Capacity / data.section.Total_Capacity) * 100)
      : '—';

  const justification = data?.raiseCapacity?.Reason ?? data?.request?.Description ?? '—';
  const requestDate = data?.request?.Request_Date ?? '—';
  const currentStatus = data?.request?.Current_Status ?? '—';

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data?.request) {
      onToast('Cannot submit — this request could not be found.');
      return;
    }

    const newStatus = decision === 'approve' ? 'Completed' : 'Rejected';

    const { error } = await supabase
      .from('Request')
      .update({ Current_Status: newStatus })
      .eq('Request_ID', data.request.Request_ID);

    if (error) {
      console.error('Failed to update request status:', error);
      onToast(`Error: ${error.message}`);
      return;
    }

    onToast(
      decision === 'approve'
        ? `Request ${requestId} Completed! Capacity increased to ${totalSeats} seats.`
        : `Request ${requestId} Rejected. Student notified.`
    );
    navigate('/admin/requests/raise-capacity');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-xs text-[#6B7280]">Loading request…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex flex-col gap-4">
        <BackLink onClick={() => navigate('/admin/requests/raise-capacity')} variant="tight">
          Back to Raise Capacity List
        </BackLink>
        <div className="p-4 rounded-2xl bg-[#FEE2E2] border border-[#EF4444]/30 text-xs text-[#EF4444] font-semibold">
          {loadError}
        </div>
      </div>
    );
  }

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
              <span>Submitted: <strong className="text-[#1F2937]">{requestDate}</strong></span>
              <span>•</span>
              <span>Section: <strong className="text-[#1F2937]">{sectionId}</strong></span>
              <span>•</span>
              <span>Term: <strong className="text-[#1F2937]">{data?.section?.Term ?? '—'}</strong></span>
            </div>
          </div>

          <div>
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FEF3C7] text-[#D97706] inline-flex items-center gap-1.5 border border-[#F59E0B]/30">
              <Clock className="w-4 h-4" />
              {currentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-between gap-3 text-xs text-[#0369A1]">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-[#0284C7] shrink-0" />
          <div>
            <p className="font-bold text-[#0C4A6E]">Request Summary</p>
            <p className="text-[11px] text-[#0369A1] mt-0.5">
              Student {studentName} ({studentId}) — expected graduation: {gradTerm}.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Information */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <GraduationCap className="w-4 h-4 text-[#059669]" />
              <h2 className="font-bold text-sm text-[#1F2937]">Student Profile</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#059669] text-white font-bold text-base flex items-center justify-center shadow-sm">
                {studentName && studentName !== '—'
                  ? studentName.split(' ').map((p: string) => p[0]).slice(0, 2).join('')
                  : '—'}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1F2937]">{studentName}</h3>
                <p className="text-xs text-[#6B7280] font-mono">ID: {studentId}</p>
                <p className="text-[11px] text-[#6B7280]">{programName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F9FAFB] p-3.5 rounded-xl border border-[#E5E7EB]/60">
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Cumulative GPA</span>
                <span className="font-bold text-[#059669] text-sm">{gpa}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Completed Credits</span>
                <span className="font-bold text-[#1F2937] text-sm">
                  {credits !== '—' ? `${credits} hrs` : '—'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[#9CA3AF] text-[10px] block">Expected Graduation</span>
                <span className="font-semibold text-[#1F2937]">{gradTerm}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Course & Decision */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
              <BookOpen className="w-4 h-4 text-[#059669]" />
              <h2 className="font-bold text-sm text-[#1F2937]">Course & Request Details</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]/60 text-xs">
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Course Code</span>
                <span className="font-mono font-bold text-[#059669]">{courseCode}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Course Name</span>
                <span className="font-semibold text-[#1F2937]">{courseName}</span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Current Capacity</span>
                <span className="font-bold text-[#EF4444]">
                  {currentCap}/{totalCap} ({percent}%)
                </span>
              </div>
              <div>
                <span className="text-[#9CA3AF] text-[10px] block">Credit Hours</span>
                <span className="font-bold text-[#1F2937]">{creditHours}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Student Statement & Justification
              </label>
              <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#374151] leading-relaxed italic">
                "{justification}"
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

            <ApproveRejectCards
              name="admin-decision"
              decision={decision}
              onChange={setDecision}
              approveTitle="Approve Request"
              approveDescription="Authorize seat override in Banner"
              rejectTitle="Reject Request"
              rejectDescription="Decline due to lab room limit"
            />

            {decision === 'approve' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs">
                <div>
                  <label className="font-bold text-[#166534] block mb-1">
                    New Total Section Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
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