import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Search,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { sampleAdminRequests } from '../../../mocks/requests.mock';
import { toRequestSlug } from '../../../app/routeHelpers';
import { courseStudentsData } from '../mocks/courses.mock';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FilterTab } from '../../../components/common/FilterTab';
import { BackLink } from '../../../components/common/BackLink';

interface AdminCourseDetailsPageProps {
  onToast: (msg: string) => void;
}

export const AdminCourseDetailsPage: React.FC<AdminCourseDetailsPageProps> = ({
  onToast,
}) => {
  const navigate = useNavigate();
  // NOTE: the route carries :courseCode (see router.tsx), but this
  // page's content has always been hardcoded to "Programming I -
  // Section 31" regardless of which course was actually clicked from
  // AdminRaiseCapacityDashboard — that pre-existing limitation is
  // unrelated to bugs #3/#4 and was left as-is per Phase 6 scope.
  const { courseCode } = useParams();
  const [activeTab, setActiveTab] = useState<string>('All Students');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const tabs = ['All Students', 'Pending Review', 'Approved', 'Rejected', 'High Priority'];

  const filteredStudents = courseStudentsData.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'All Students' ||
      (activeTab === 'Pending Review' && s.status === 'Pending') ||
      (activeTab === 'Approved' && s.status === 'Approved') ||
      (activeTab === 'Rejected' && s.status === 'Rejected') ||
      (activeTab === 'High Priority' && s.priority === 'High');

    return matchesSearch && matchesTab;
  });


  /**
   * BUG #4 FIX — see Phase 6 report for full before/after detail.
   *
   * `courseStudentsData` rows only have a bare student `id`/`name` —
   * previously this row object was force-passed as if it were a full
   * AcademicRequest, which produced wrong student details and a
   * student ID displayed as a "Request ID". Fixed by resolving the
   * clicked student to a REAL raise-capacity request via the one
   * relationship the mock data actually supports: matching
   * `courseStudentsData[i].id` against `AcademicRequest.studentId`
   * for type === 'Raise Capacity'. 3 of the 6 mock students
   * (U22107821, U22106421, U22105511) have such a match; for the
   * other 3, no fake relational data was invented — they navigate to
   * the review page with no request ID, which renders the same
   * generic fallback it already used to show for any unmatched/
   * missing data.
   */
  const resolveReviewPath = (studentId: string): string => {
    const matched = sampleAdminRequests.find(
      (r) => r.type === 'Raise Capacity' && r.studentId === studentId
    );
    return matched
      ? `/admin/requests/raise-capacity/review/${toRequestSlug(matched.id)}`
      : '/admin/requests/raise-capacity/review';
  };

  return (
    <div id="admin-course-details-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Top Breadcrumb Back & Export Bar */}
      <div>
        <BackLink onClick={() => navigate('/admin/requests/raise-capacity')} variant="tight">
          Back to Raise Capacity Overview
        </BackLink>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Programming I - Section 31
            </h1>
            <p className="text-xs font-semibold text-[#059669] mt-0.5">
              Course: 1501263 • Instructor: Dr. Ahmed • Spring 2026
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
              />
            </div>
            <button
              onClick={() => onToast('Student petition list exported to CSV.')}
              className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-xs font-bold text-[#4B5563] flex items-center gap-1.5 shrink-0 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Info Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
            Section Capacity & Logistics
          </span>
          <h2 className="text-lg font-bold text-[#1F2937] mt-0.5">
            Raise Capacity Requests
          </h2>
          <div className="flex items-center gap-4 text-xs text-[#6B7280] mt-2 flex-wrap">
            <span>Room: <strong className="text-[#1F2937]">Lab W8-102</strong></span>
            <span>•</span>
            <span>Current: <strong className="text-[#EF4444]">32/30 (Over Capacity)</strong></span>
            <span>•</span>
            <span>Schedule: <strong className="text-[#1F2937]">MW 10:00 - 11:30 AM</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#F3F4F6] pt-4 md:pt-0 md:pl-6">
          <div className="text-center px-2">
            <span className="text-xl font-extrabold text-[#1F2937]">[8]</span>
            <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Total Requests</p>
          </div>
          <div className="text-center px-2">
            <span className="text-xl font-extrabold text-[#D97706]">[5]</span>
            <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Pending</p>
          </div>
          <div className="text-center px-2">
            <span className="text-xl font-extrabold text-[#059669]">[3]</span>
            <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">Approved</p>
          </div>
        </div>
      </div>

      {/* Students Table Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Filter Tabs */}
        <div className="p-5 border-b border-[#F3F4F6] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
            {tabs.map((tab) => (
              <FilterTab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                variant="plain"
              />
            ))}
          </div>
          <span className="text-xs text-[#6B7280]">
            Showing <strong className="text-[#1F2937]">6</strong> of{' '}
            <strong className="text-[#1F2937]">24</strong> students
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">GPA</th>
                <th className="py-3.5 px-4">Credit Hours</th>
                <th className="py-3.5 px-4">Request Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredStudents.map((s, idx) => (
                <tr
                  key={idx}
                  onClick={() => navigate(resolveReviewPath(s.id))}
                  className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                    {s.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1F2937] group-hover:text-[#059669]">
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#059669]">{s.gpa}</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{s.creditHours} hrs</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{s.requestDate}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={s.status} fallbackLabel="Pending Review" /></td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(resolveReviewPath(s.id));
                      }}
                      className="p-2 rounded-xl bg-[#F9FAFB] group-hover:bg-[#059669] group-hover:text-white text-[#4B5563] transition-all"
                      aria-label="Review student petition"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            Showing <span className="font-bold text-[#1F2937]">6</span> of{' '}
            <span className="font-bold text-[#1F2937]">24</span> students
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === num
                    ? 'bg-[#059669] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
              disabled={currentPage === 4}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
