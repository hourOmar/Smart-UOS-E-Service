import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  BarChart3,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { toRequestSlug } from '../../../app/routeHelpers';
import { supabase } from '../../../services/supabase/client';
import { listActiveRequests } from '../../../services/supabase/requests';
import { StatCard } from '../../../components/common/StatCard';

interface AdminDashboardProps {
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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  searchQuery,
}) => {
  const navigate = useNavigate();
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All Requests');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const statusFilters = [
    'All Requests',
    'Pending Review',
    'Approved',
    'Rejected',
  ];

  // Request type cards. Counts are computed live from the requests we fetched.
  const requestTypeCards = [
    {
      id: 'rc',
      title: 'Raise Capacity',
      typeKey: 'Raise Capacity',
      icon: <TrendingUp className="w-5 h-5 text-[#059669]" />,
      path: '/admin/requests/raise-capacity',
    },
    {
      id: 'ie',
      title: 'Incomplete Exam',
      typeKey: 'Incomplete Exam',
      icon: <FileText className="w-5 h-5 text-[#0284C7]" />,
      path: '/admin/requests/incomplete-exam/review',
    },
    {
      id: 'gc',
      title: 'Grade Change',
      typeKey: 'Grade Change',
      icon: <BarChart3 className="w-5 h-5 text-[#F59E0B]" />,
      path: '/admin/requests/grade-change/review',
    },
    {
      id: 'pc',
      title: 'Program Change',
      typeKey: 'Program Change',
      icon: <RefreshCw className="w-5 h-5 text-[#8B5CF6]" />,
      path: '/admin/requests/program-change/review',
    },
    {
      id: 'ce',
      title: 'Course Equivalency',
      typeKey: 'Course Equivalency',
      icon: <Scale className="w-5 h-5 text-[#0D9488]" />,
      path: '/admin/history',
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await listActiveRequests();
        // Convert AcademicRequest rows to our local RequestRow shape.
        // `listActiveRequests` returns AcademicRequest, which already
        // has `id`, `studentName`, `type`, `status`, etc.
        const rows: RequestRow[] = (data as any[]).map((r) => ({
          Request_ID: r.id,
          Request_Type: r.type,
          Request_Date: r.submittedDate,
          Description: r.reason ?? r.notes ?? null,
          Current_Status: r.status,
          Student_ID: r.studentId,
          Student: r.studentName ? { Student_Name: r.studentName } : null,
        }));
        setRequests(rows);
      } catch (err) {
        console.error('Failed to load requests:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Counts by type + by status
  const countForType = (type: string) => {
    const matching = requests.filter((r) => r.Request_Type === type);
    return {
      pending: matching.filter((r) => r.Current_Status === 'In Progress').length,
      total: matching.length,
    };
  };

  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.Current_Status === 'In Progress').length;
  const approvedCount = requests.filter((r) => r.Current_Status === 'Completed').length;
  const rejectedCount = requests.filter((r) => r.Current_Status === 'Rejected').length;

  const filteredRequests = requests.filter((req) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      req.Request_ID.toLowerCase().includes(q) ||
      (req.Student?.Student_Name ?? '').toLowerCase().includes(q) ||
      (req.Student_ID ?? '').toLowerCase().includes(q);

    const matchesStatus =
      activeStatusFilter === 'All Requests' ||
      (activeStatusFilter === 'Pending Review' && req.Current_Status === 'In Progress') ||
      (activeStatusFilter === 'Approved' && req.Current_Status === 'Completed') ||
      (activeStatusFilter === 'Rejected' && req.Current_Status === 'Rejected');

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'Rejected':
        return 'bg-[#FEE2E2] text-[#EF4444]';
      case 'In Progress':
      case 'Pending Review':
        return 'bg-[#FEF3C7] text-[#D97706]';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563]';
    }
  };

  const getStatusLabel = (status: string | null) => {
    if (status === 'Completed') return 'Approved';
    return status ?? 'In Progress';
  };

  const handleRowAction = (req: RequestRow) => {
    const slug = toRequestSlug(req.Request_ID);
    if (req.Request_Type === 'Raise Capacity') {
      navigate(`/admin/requests/raise-capacity/review/${slug}`);
    } else if (req.Request_Type === 'Incomplete Exam') {
      navigate(`/admin/requests/incomplete-exam/review/${slug}`);
    } else if (req.Request_Type === 'Grade Change') {
      navigate(`/admin/requests/grade-change/review/${slug}`);
    } else if (req.Request_Type === 'Program Change') {
      navigate(`/admin/requests/program-change/review/${slug}`);
    } else {
      navigate('/admin/history');
    }
  };

  return (
    <div id="admin-dashboard-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* 4 Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-card-admin-pending"
          icon="📋"
          iconColorClass="bg-[#FEF3C7] text-[#D97706]"
          value={String(pendingCount)}
          valueColorClass="text-[#1F2937]"
          label="Pending Requests"
        />
        <StatCard
          id="stat-card-admin-high-priority"
          icon="⏳"
          iconColorClass="bg-[#FEE2E2] text-[#EF4444]"
          value={String(rejectedCount)}
          valueColorClass="text-[#EF4444]"
          label="Rejected Requests"
        />
        <StatCard
          id="stat-card-admin-approved"
          icon="✅"
          iconColorClass="bg-[#D1FAE5] text-[#059669]"
          value={String(approvedCount)}
          valueColorClass="text-[#059669]"
          label="Approved Requests"
        />
        <StatCard
          id="stat-card-admin-total"
          icon="📚"
          iconColorClass="bg-[#E0F2FE] text-[#0284C7]"
          value={String(totalRequests)}
          valueColorClass="text-[#0284C7]"
          label="Total Requests"
        />
      </section>

      {/* 5 Request Type Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1F2937] tracking-tight">
            Academic Petitions & Request Queues
          </h2>
          <button
            onClick={() => navigate('/admin/requests/raise-capacity')}
            className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
          >
            <span>Manage All Queues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {requestTypeCards.map((card, idx) => {
            const counts = countForType(card.typeKey);
            return (
              <div
                key={idx}
                id={`admin-type-card-${idx}`}
                onClick={() => navigate(card.path)}
                className="bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#059669] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#F3F4F6] group-hover:bg-[#D1FAE5]/60 transition-colors">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                    {counts.pending} pending
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#1F2937] group-hover:text-[#059669] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{counts.total} total</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Requests Table */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F3F4F6] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#1F2937]">Incoming Requests</h2>
            <span className="text-xs text-[#6B7280]">
              Showing <strong className="text-[#1F2937]">{filteredRequests.length}</strong> of{' '}
              <strong className="text-[#1F2937]">{totalRequests}</strong> requests
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            {statusFilters.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  activeStatusFilter === tab
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Request Type</th>
                <th className="py-3.5 px-4">Submitted</th>
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
                    No requests found.
                  </td>
                </tr>
              )}
              {!loading && filteredRequests.map((req) => (
                <tr key={req.Request_ID} className="hover:bg-[#F9FAFB]/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                    <button
                      onClick={() => handleRowAction(req)}
                      className="hover:underline"
                    >
                      {req.Request_ID}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#1F2937]">
                      {req.Student?.Student_Name ?? '—'}
                    </p>
                    <p className="text-[11px] text-[#6B7280] font-mono">
                      {req.Student_ID ?? ''}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#1F2937]">{req.Request_Type}</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{req.Request_Date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${getStatusBadgeClass(
                        req.Current_Status
                      )}`}
                    >
                      {getStatusLabel(req.Current_Status)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRowAction(req)}
                      className="px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition-all"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            Showing <span className="font-bold text-[#1F2937]">{filteredRequests.length}</span> of{' '}
            <span className="font-bold text-[#1F2937]">{totalRequests}</span> requests
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-[#1F2937]">
              Page {currentPageNum}
            </span>
            <button
              onClick={() => setCurrentPageNum(currentPageNum + 1)}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};