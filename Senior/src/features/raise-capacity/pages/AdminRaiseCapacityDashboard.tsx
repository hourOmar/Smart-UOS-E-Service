import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { coursesList } from '../mocks/courses.mock';
import { StatCard } from '../../../components/common/StatCard';
import { FilterTab } from '../../../components/common/FilterTab';

interface AdminRaiseCapacityDashboardProps {
  searchQuery: string;
}

export const AdminRaiseCapacityDashboard: React.FC<AdminRaiseCapacityDashboardProps> = ({
  searchQuery,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('All Courses');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const tabs = ['All Courses', 'High Demand', 'Pending Review', 'Recently Approved'];

  const effectiveSearch = localSearch || searchQuery;

  const filteredCourses = coursesList.filter((c) => {
    const matchesSearch =
      !effectiveSearch ||
      c.code.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.instructor.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      c.department.toLowerCase().includes(effectiveSearch.toLowerCase());

    const matchesTab =
      activeTab === 'All Courses' ||
      (activeTab === 'High Demand' && c.pendingRequests >= 5) ||
      (activeTab === 'Pending Review' && c.pendingRequests > 0) ||
      (activeTab === 'Recently Approved' && !c.critical);

    return matchesSearch && matchesTab;
  });

  return (
    <div id="admin-raise-capacity-dashboard" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
            Raise Capacity Requests
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Manage course capacity increase requests and section seat allocations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course code or name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
            />
          </div>
          <button className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-xs font-semibold text-[#4B5563] flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/*
        PLACEHOLDER DASHBOARD METRICS
        The 4 stat values below are inline literals, not yet extracted
        to a mock file (unlike the dashboard's top-line stats).
        TODO: Replace with a backend API response calculated from
        course/request records.
        Future source: FastAPI backend-calculated aggregate endpoint.
        Persistence: TBD — backend persistence decision.
      */}
      {/* 4 Statistics Cards in a Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📚"
          iconColorClass="bg-[#F3F4F6] text-[#4B5563]"
          value="[24]"
          valueColorClass="text-[#1F2937]"
          label="Total Courses"
        />
        <StatCard
          icon="⏳"
          iconColorClass="bg-[#FEF3C7] text-[#D97706]"
          value="[18]"
          valueColorClass="text-[#D97706]"
          label="Pending Requests"
        />
        <StatCard
          icon="✅"
          iconColorClass="bg-[#D1FAE5] text-[#059669]"
          value="[6]"
          valueColorClass="text-[#059669]"
          label="Approved Today"
        />
        <StatCard
          icon="⚠️"
          iconColorClass="bg-[#FEE2E2] text-[#EF4444]"
          value="[4]"
          valueColorClass="text-[#EF4444]"
          label="Critical Capacity"
        />
      </div>

      {/* Main Courses Table Card */}
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
            <strong className="text-[#1F2937]">24</strong> courses
          </span>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4">Course Code</th>
                <th className="py-3.5 px-4">Course Name</th>
                <th className="py-3.5 px-4">Section</th>
                <th className="py-3.5 px-4 w-48">Capacity</th>
                <th className="py-3.5 px-4">Pending Requests</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredCourses.slice(0, 6).map((course, idx) => {
                const percent = Math.min(
                  100,
                  Math.round((course.currentEnrollment / course.maxCapacity) * 100)
                );
                const isOver = course.currentEnrollment >= course.maxCapacity;

                return (
                  <tr
                    key={idx}
                    onClick={() => navigate(`/admin/requests/raise-capacity/courses/${course.code}`)}
                    className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                      {course.code}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1F2937] group-hover:text-[#059669]">
                      {course.name}
                      <span className="block text-[11px] text-[#6B7280] font-normal">
                        {course.instructor} • {course.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563]">
                        {course.section}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold">{course.capacity}</span>
                        <span className={`font-bold ${isOver ? 'text-[#EF4444]' : 'text-[#059669]'}`}>
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isOver ? 'bg-[#EF4444]' : 'bg-[#059669]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#D97706] inline-flex items-center gap-1">
                        {course.pendingRequests} requests
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/requests/raise-capacity/courses/${course.code}`);
                        }}
                        className="p-2 rounded-xl bg-[#F9FAFB] group-hover:bg-[#059669] group-hover:text-white text-[#4B5563] transition-all"
                        aria-label="View course section"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            Showing <span className="font-bold text-[#1F2937]">6</span> of{' '}
            <span className="font-bold text-[#1F2937]">24</span> courses
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
