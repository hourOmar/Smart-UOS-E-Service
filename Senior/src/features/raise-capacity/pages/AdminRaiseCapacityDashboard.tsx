import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { listRaiseCapacityRequests } from '../../../services/supabase/requests';
import { toRequestSlug } from '../../../app/routeHelpers';
import { supabase } from '../../../services/supabase/client';
import { StatCard } from '../../../components/common/StatCard';
import { FilterTab } from '../../../components/common/FilterTab';

interface AdminRaiseCapacityDashboardProps {
  searchQuery: string;
}

interface RequestRow {
  Request_ID: string;
  Request_Type: string;
  Request_Date: string;
  Description: string | null;
  Current_Status: string | null;
  Student_ID: string | null;
  Student?: { Student_Name: string | null } | null;
}

interface CourseInfo {
  Course_ID: number;
  Course_Name: string;
  Credit_Hours: number | null;
}

interface SectionInfo {
  Section_ID: string;
  Course_ID: number;
  Term: string;
  Current_Capacity: number;
  Total_Capacity: number;
}

interface RaiseCapacityRow extends RequestRow {
  RaiseCapacity?: {
    Course_ID: number;
    Section_ID: string;
    Term: string;
  } | null;
  Course?: CourseInfo | null;
  Section?: SectionInfo | null;
}

export const AdminRaiseCapacityDashboard: React.FC<AdminRaiseCapacityDashboardProps> = ({
  searchQuery,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('All Requests');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [requests, setRequests] = useState<RaiseCapacityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All Requests', 'Pending Review', 'Approved', 'Rejected'];

  const effectiveSearch = localSearch || searchQuery;

  useEffect(() => {
    (async () => {
      try {
        const raw = await listRaiseCapacityRequests();

        // Enrich each request with its Raise_Capacity subtype row, the
        // referenced Course, and the Section (matched on the triple
        // Course_ID + Section_ID + Term).
        const enriched: RaiseCapacityRow[] = await Promise.all(
          (raw as RequestRow[]).map(async (r) => {
            const { data: rc } = await supabase
              .from('Raise_Capacity')
              .select('Course_ID, Section_ID, Term')
              .eq('Request_ID', r.Request_ID)
              .maybeSingle();

            if (!rc) return { ...r, RaiseCapacity: null, Course: null, Section: null };

            const [{ data: course }, { data: section }] = await Promise.all([
              supabase
                .from('Course')
                .select('Course_ID, Course_Name, Credit_Hours')
                .eq('Course_ID', rc.Course_ID)
                .maybeSingle(),
              supabase
                .from('Section')
                .select('Section_ID, Course_ID, Term, Current_Capacity, Total_Capacity')
                .eq('Section_ID', rc.Section_ID)
                .eq('Course_ID', rc.Course_ID)
                .eq('Term', rc.Term)
                .maybeSingle(),
            ]);

            return {
              ...r,
              RaiseCapacity: rc,
              Course: course ?? null,
              Section: section ?? null,
            };
          })
        );

        setRequests(enriched);
      } catch (err) {
        console.error('Failed to load raise capacity requests:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const q = effectiveSearch.toLowerCase();
    const courseId = r.Course?.Course_ID ?? r.RaiseCapacity?.Course_ID ?? '';
    const courseName = r.Course?.Course_Name ?? '';
    const studentId = r.Student_ID ?? '';
    const studentName = r.Student?.Student_Name ?? '';

    const matchesSearch =
      !effectiveSearch ||
      String(courseId).toLowerCase().includes(q) ||
      courseName.toLowerCase().includes(q) ||
      studentId.toLowerCase().includes(q) ||
      studentName.toLowerCase().includes(q);

    const status = r.Current_Status ?? '';
    const matchesTab =
      activeTab === 'All Requests' ||
      (activeTab === 'Pending Review' && status === 'In Progress') ||
      (activeTab === 'Approved' && status === 'Completed') ||
      (activeTab === 'Rejected' && status === 'Rejected');

    return matchesSearch && matchesTab;
  });

  // Live stat counts from real data
  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.Current_Status === 'In Progress').length;
  const approvedCount = requests.filter((r) => r.Current_Status === 'Completed').length;
  const rejectedCount = requests.filter((r) => r.Current_Status === 'Rejected').length;

  const goToReview = (requestId: string) => {
    navigate(`/admin/requests/raise-capacity/review/${toRequestSlug(requestId)}`);
  };

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
              placeholder="Search by course or student..."
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

      {/* Stat Cards — computed from real data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📚"
          iconColorClass="bg-[#F3F4F6] text-[#4B5563]"
          value={String(totalRequests)}
          valueColorClass="text-[#1F2937]"
          label="Total Requests"
        />
        <StatCard
          icon="⏳"
          iconColorClass="bg-[#FEF3C7] text-[#D97706]"
          value={String(pendingCount)}
          valueColorClass="text-[#D97706]"
          label="Pending Review"
        />
        <StatCard
          icon="✅"
          iconColorClass="bg-[#D1FAE5] text-[#059669]"
          value={String(approvedCount)}
          valueColorClass="text-[#059669]"
          label="Approved"
        />
        <StatCard
          icon="⚠️"
          iconColorClass="bg-[#FEE2E2] text-[#EF4444]"
          value={String(rejectedCount)}
          valueColorClass="text-[#EF4444]"
          label="Rejected"
        />
      </div>

      {/* Requests Table Card */}
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
            Showing <strong className="text-[#1F2937]">{filteredRequests.length}</strong> of{' '}
            <strong className="text-[#1F2937]">{totalRequests}</strong> requests
          </span>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4 w-48">Capacity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {loading && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                    Loading requests...
                  </td>
                </tr>
              )}
              {!loading && filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                    No raise capacity requests found.
                  </td>
                </tr>
              )}
              {!loading && filteredRequests.map((r) => {
                const current = r.Section?.Current_Capacity ?? 0;
                const total = r.Section?.Total_Capacity ?? 0;
                const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
                const isOver = current >= total && total > 0;

                return (
                  <tr
                    key={r.Request_ID}
                    onClick={() => goToReview(r.Request_ID)}
                    className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                      {r.Request_ID}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1F2937] group-hover:text-[#059669]">
                      {r.Student?.Student_Name ?? r.Student_ID ?? '—'}
                      <span className="block text-[11px] text-[#6B7280] font-normal font-mono">
                        {r.Student_ID ?? ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#1F2937]">
                        {r.Course?.Course_Name ?? '—'}
                      </span>
                      <span className="block text-[11px] text-[#6B7280] font-normal font-mono">
                        {r.RaiseCapacity
                          ? `${r.RaiseCapacity.Course_ID} • Section ${r.RaiseCapacity.Section_ID} • ${r.RaiseCapacity.Term}`
                          : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold">{current}/{total}</span>
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
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          r.Current_Status === 'Completed'
                            ? 'bg-[#D1FAE5] text-[#059669]'
                            : r.Current_Status === 'Rejected'
                            ? 'bg-[#FEE2E2] text-[#EF4444]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        {r.Current_Status === 'Completed'
                          ? 'Approved'
                          : r.Current_Status ?? 'In Progress'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToReview(r.Request_ID);
                        }}
                        className="p-2 rounded-xl bg-[#F9FAFB] group-hover:bg-[#059669] group-hover:text-white text-[#4B5563] transition-all"
                        aria-label="Review request"
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

        {/* Pagination — simplified since we now have real filtered data */}
        <div className="p-4 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            Showing <span className="font-bold text-[#1F2937]">{filteredRequests.length}</span> of{' '}
            <span className="font-bold text-[#1F2937]">{totalRequests}</span> requests
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-[#1F2937]">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
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