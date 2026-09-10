import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { CollegeItem } from '../types/programChange.types';
import { colleges, currentStudentData } from '../mocks/programChange.mock';
import { BackLink } from '../../../components/common/BackLink';

export const StudentProgramChangeCollegesPage: React.FC = () => {
  const navigate = useNavigate();

  /**
   * BUG #3 FIX
   *
   * Previously navigated with `{ college: col.name }`, but the
   * receiving side (App.tsx) read `extraData?.collegeName` — a key
   * mismatch that meant the selected college was silently dropped,
   * and the Majors page always defaulted to Computing and Informatics
   * regardless of which college was clicked.
   *
   * Fixed by routing on `col.id` — the stable slug already present in
   * every CollegeItem in mock data (e.g. 'cci', 'eng', 'cba' — see
   * features/program-change/mocks/programChange.mock.ts). No new
   * identifier was invented; this is the same id the mock data
   * already used as its own key.
   */
  const handleCollegeClick = (col: CollegeItem) => {
    navigate(`/student/requests/program-change/${col.id}/majors`);
  };

  return (
    <div id="student-program-change-colleges-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Back Link */}
      <div>
        <BackLink onClick={() => navigate('/student/dashboard')} variant="wide">
          ← Back to Dashboard
        </BackLink>
      </div>

      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
          Program Change Request
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Request to change your academic program or major across colleges
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
                Current Enrolled Major
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

      {/* Colleges Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-sm font-bold text-[#1F2937]">Select Target College</h2>
          <p className="text-xs text-[#6B7280]">
            Browse all 14 university colleges. Click <strong className="text-[#059669]">College of Computing and Informatics</strong> to view specialized computing majors.
          </p>
        </div>
      </div>

      {/* 14+ Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((col) => {
          const isCCI = col.id === 'cci';
          return (
            <div
              key={col.id}
              id={`college-card-${col.id}`}
              onClick={() => handleCollegeClick(col)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 group ${
                isCCI
                  ? 'border-[#059669] bg-[#F0FDF4]/60 hover:bg-[#F0FDF4] hover:shadow-md ring-1 ring-[#059669]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#059669] hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3
                    className={`font-extrabold text-sm transition-colors ${
                      isCCI ? 'text-[#059669]' : 'text-[#1F2937] group-hover:text-[#059669]'
                    }`}
                  >
                    {col.name}
                  </h3>
                  {isCCI && (
                    <span className="px-2 py-0.5 rounded-md bg-[#059669] text-white text-[10px] font-bold shrink-0">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                  {col.tagline}
                </p>

                <div className="mt-3 inline-block px-2.5 py-1 rounded-lg bg-[#F3F4F6] text-[#4B5563] text-[11px] font-semibold">
                  Degrees: {col.degreeTypes}
                </div>
              </div>

              {/* Requirements Check Section */}
              <div className="pt-3 border-t border-[#F3F4F6] flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  {col.gpaMet ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                  )}
                  <span className={col.gpaMet ? 'text-[#065F46] font-medium text-[11px]' : 'text-[#B91C1C] font-medium text-[11px]'}>
                    {col.gpaReq}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {col.foundationMet ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                  )}
                  <span className={col.foundationMet ? 'text-[#065F46] font-medium text-[11px]' : 'text-[#B91C1C] font-medium text-[11px]'}>
                    {col.foundationReq}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 mt-1 border-t border-dashed border-[#E5E7EB]">
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    {col.programsCount} Programs Available
                  </span>
                  <span className="text-xs font-bold text-[#059669] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>View Majors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
