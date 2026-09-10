import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  Cpu,
  BrainCircuit,
  Database,
  Layers,
} from 'lucide-react';
import { SubmittedRequestData } from '../../../types';
import { MajorItem } from '../types/programChange.types';
import { currentStudentData, colleges } from '../mocks/programChange.mock';
import { BackLink } from '../../../components/common/BackLink';

interface StudentProgramChangeMajorsPageProps {
  onToast: (msg: string) => void;
}

export const StudentProgramChangeMajorsPage: React.FC<StudentProgramChangeMajorsPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  // BUG #3 FIX (receiving side) — see StudentProgramChangeCollegesPage.tsx
  // for the sending-side fix. `colleges[0]` (College of Computing and
  // Informatics) matches the exact default the old `collegeName` prop
  // used to fall back to, so an unmatched/missing param preserves the
  // same default behavior as before.
  const { collegeId } = useParams();
  const selectedCollege = colleges.find((c) => c.id === collegeId) ?? colleges[0];
  // PLACEHOLDER MAJOR CATALOG + ELIGIBILITY DATA
  // Kept local (not moved to mocks/) because each item's `icon` is a
  // JSX element, which can't live cleanly in a plain .ts mock file.
  //
  // TODO: Replace with data returned by the FastAPI backend.
  // Future source: FastAPI backend (programs catalog).
  // Persistence: TBD — backend persistence decision.
  //
  // PLACEHOLDER — FUTURE SOURCE TBD for `gpaMet` / `foundationMet` /
  // `prereqMet`: these look like eligibility computations, but the
  // planned Program Change Academic Eligibility Evaluation Agent has
  // not yet been confirmed to be their source. Do not assume this is
  // AI agent output until confirmed with the domain/agent design.
  //
  // KNOWN PRE-EXISTING LIMITATION (unrelated to bug #3): this list is
  // always the same 4 Computing majors regardless of which college
  // was selected — there is no per-college majors catalog in mock
  // data. Bug #3 only fixed the college NAME shown above; inventing
  // majors data for the other 13 colleges was out of scope for
  // Phase 6 (would mean fabricating a catalog, not fixing a bug).
  const majors: MajorItem[] = [
    {
      id: 'cs',
      name: 'Computer Science',
      college: 'College of Computing and Informatics',
      degree: 'Bachelor of Science',
      creditsDuration: '[120 credits • 4 years]',
      minGpa: 'Minimum GPA: 2.5 (You have 3.62)',
      currentGpa: '3.62',
      gpaMet: true,
      foundation: 'Foundation Courses: 12/12 credits',
      foundationMet: true,
      prereq: 'Prerequisite: Programming I (B+)',
      prereqMet: true,
      icon: <Cpu className="w-5 h-5 text-[#059669]" />,
    },
    {
      id: 'ai',
      name: 'Artificial Intelligence',
      college: 'College of Computing and Informatics',
      degree: 'Bachelor of Science',
      creditsDuration: '[120 credits • 4 years]',
      minGpa: 'Minimum GPA: 2.8 (You have 3.62)',
      currentGpa: '3.62',
      gpaMet: true,
      foundation: 'Foundation Courses: 12/12 credits',
      foundationMet: true,
      prereq: 'Prerequisite: Programming I (B+)',
      prereqMet: true,
      icon: <BrainCircuit className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      id: 'it-mm',
      name: 'Information Technology - Multimedia',
      college: 'College of Computing and Informatics',
      degree: 'Bachelor of Science',
      creditsDuration: '[120 credits • 4 years]',
      minGpa: 'Minimum GPA: 2.3 (You have 3.62)',
      currentGpa: '3.62',
      gpaMet: true,
      foundation: 'Foundation Courses: 12/12 credits',
      foundationMet: true,
      prereq: 'Prerequisite: Programming I (B+)',
      prereqMet: true,
      icon: <Layers className="w-5 h-5 text-[#0284C7]" />,
    },
    {
      id: 'bmi',
      name: 'Biomedical Informatics',
      college: 'College of Computing and Informatics',
      degree: 'Bachelor of Science',
      creditsDuration: '[120 credits • 4 years]',
      minGpa: 'Minimum GPA: 2.5 (You have 3.62)',
      currentGpa: '3.62',
      gpaMet: true,
      foundation: 'Foundation Courses: 12/12 credits',
      foundationMet: true,
      prereq: 'Prerequisite: Programming I (B+)',
      prereqMet: true,
      icon: <Database className="w-5 h-5 text-[#D97706]" />,
    },
  ];

  const [selectedMajor, setSelectedMajor] = useState<MajorItem>(majors[1]); // Defaults to AI
  const [reason, setReason] = useState<string>(
    'I have developed a keen interest in deep learning and natural language processing through extracurricular projects. My mathematical background and GPA in foundational programming courses align closely with the Artificial Intelligence track requirements.'
  );
  const [desiredSemester, setDesiredSemester] = useState<string>('[Fall 2026]');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subData: SubmittedRequestData = {
      requestId: `[#PC-2026-${Math.floor(100 + Math.random() * 900)}]`,
      requestType: 'Program Change Request',
      course: `From ${currentStudentData.program} → ${selectedMajor.name}`,
      submittedDate: '[Today, Mar 2026]',
      estimatedProcessing: '[7-10 Working Days]',
      status: 'Committee Review',
      details: `Transfer request to ${selectedMajor.name} (${selectedMajor.degree}) effective ${desiredSemester}.`,
    };

    onToast('Petition submitted successfully to academic committee.');
    navigate('/student/requests/success', { state: subData });
  };

  return (
    <div id="student-program-change-majors-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <BackLink onClick={() => navigate('/student/requests/program-change')} variant="wide">
          ← Back to Colleges
        </BackLink>
      </div>

      {/* Header Section */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          {selectedCollege.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Select your desired program from the available majors below
        </p>
      </header>

      {/* Current Program Card */}
      <section className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#059669] flex items-center justify-center font-bold text-xl shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider">
                Current Program
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669] text-[10px] font-bold">
                {currentStudentData.standing}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-[#1F2937] mt-0.5">
              {currentStudentData.program}
            </h2>
            <p className="text-xs text-[#6B7280]">{currentStudentData.college}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-[#F3F4F6] pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
              Cumulative GPA
            </span>
            <span className="text-base font-extrabold text-[#1F2937]">{currentStudentData.gpa}</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider block">
              Completed Credits
            </span>
            <span className="text-base font-extrabold text-[#1F2937]">
              {currentStudentData.credits}
            </span>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-[#059669] text-white text-xs font-bold shadow-xs">
            Eligible for Change ✓
          </span>
        </div>
      </section>

      {/* Majors Grid */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-[#1F2937]">Available Majors in Computing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {majors.map((m) => {
            const isSelected = selectedMajor.id === m.id;
            return (
              <div
                key={m.id}
                id={`major-card-${m.id}`}
                onClick={() => setSelectedMajor(m)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-[#059669] bg-[#F0FDF4] shadow-md ring-2 ring-[#059669]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#059669] hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#059669]">{m.college}</span>
                    {isSelected && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#059669] text-white text-[10px] font-bold">
                        Selected Program ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="p-2 rounded-xl bg-[#F3F4F6]">{m.icon}</div>
                    <div>
                      <h3 className="text-base font-extrabold text-[#1F2937]">{m.name}</h3>
                      <p className="text-xs text-[#6B7280]">
                        {m.degree} • {m.creditsDuration}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requirements Check box */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {m.gpaMet ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    )}
                    <span className="text-[#374151] font-medium">{m.minGpa}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.foundationMet ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    )}
                    <span className="text-[#374151] font-medium">{m.foundation}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.prereqMet ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    )}
                    <span className="text-[#374151] font-medium">{m.prereq}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Request Details Section */}
      <section className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#F3F4F6]">
          <div className="p-2 rounded-xl bg-[#E0F2FE] text-[#0284C7]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1F2937]">Request Details</h2>
            <p className="text-[11px] text-[#6B7280]">Complete your transfer statement & timeline</p>
          </div>
        </div>

        {/* Selected Program Preview (Light Blue Box) */}
        <div className="p-4 rounded-xl bg-[#F0F4FF] border border-[#BFDBFE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#1E40AF] tracking-wider block">
              Selected Target Program
            </span>
            <h3 className="text-sm font-extrabold text-[#1E3A8A] mt-0.5">
              {selectedMajor.name} ({selectedMajor.degree})
            </h3>
            <p className="text-[#3B82F6]">{selectedMajor.college}</p>
          </div>
          <span className="px-3 py-1 rounded-lg bg-[#DBEAFE] text-[#1D4ED8] font-bold text-xs">
            {selectedMajor.creditsDuration}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1F2937]">
                Reason for Program Change *
              </label>
              <textarea
                rows={4}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State your academic and career justification for transitioning into this program..."
                className="w-full text-xs p-3 rounded-xl border border-[#D1D5DB] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-hidden text-[#1F2937]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1F2937]">Desired Start Semester *</label>
                <select
                  value={desiredSemester}
                  onChange={(e) => setDesiredSemester(e.target.value)}
                  className="p-3 rounded-xl border border-[#D1D5DB] bg-white text-xs font-semibold text-[#1F2937] focus:border-[#059669] outline-hidden"
                >
                  <option value="[Fall 2026]">[Fall 2026]</option>
                  <option value="[Spring 2027]">[Spring 2027]</option>
                  <option value="[Summer 2026]">[Summer 2026]</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#6B7280] flex flex-col gap-1">
                <span className="font-bold text-[#1F2937]">Application Notice:</span>
                <span>Committee reviews occur twice per semester prior to registration week.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F3F4F6]">
            <button
              type="button"
              onClick={() => navigate('/student/requests/program-change')}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
