import React, { useState } from 'react';
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
import { AcademicRequest } from '../../../types';
import { adminDashboardStats, requestTypeCounts } from '../../../mocks/dashboard.mock';
import { sampleAdminRequests } from '../../../mocks/requests.mock';
import { toRequestSlug } from '../../../app/routeHelpers';
import { StatCard } from '../../../components/common/StatCard';

interface AdminDashboardProps {
  searchQuery: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  searchQuery,
}) => {
  const navigate = useNavigate();
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All Requests');
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>('All Departments');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);

  const statusFilters = [
    'All Requests',
    'Pending Review',
    'Committee Review',
    'High Priority',
    'Awaiting Documents',
  ];

  const deptFilters = [
    'All Departments',
    'Computer Science',
    'Engineering',
    'Mathematics',
    'Sciences',
    'Business',
  ];

  // Static frontend configuration (title/icon/route target) stays local to
  // this component; only the pending/total counts come from mock data.
  // See src/mocks/dashboard.mock.ts (`requestTypeCounts`) for details.
  const requestTypeCards = [
    {
      id: 'rc',
      title: 'Raise Capacity',
      icon: <TrendingUp className="w-5 h-5 text-[#059669]" />,
      pending: requestTypeCounts.rc.pending,
      total: requestTypeCounts.rc.total,
      path: '/admin/requests/raise-capacity',
    },
    {
      id: 'ie',
      title: 'Incomplete Exam',
      icon: <FileText className="w-5 h-5 text-[#0284C7]" />,
      pending: requestTypeCounts.ie.pending,
      total: requestTypeCounts.ie.total,
      path: '/admin/requests/incomplete-exam/review',
    },
    {
      id: 'gc',
      title: 'Grade Change',
      icon: <BarChart3 className="w-5 h-5 text-[#F59E0B]" />,
      pending: requestTypeCounts.gc.pending,
      total: requestTypeCounts.gc.total,
      path: '/admin/requests/grade-change/review',
    },
    {
      id: 'pc',
      title: 'Program Change',
      icon: <RefreshCw className="w-5 h-5 text-[#8B5CF6]" />,
      pending: requestTypeCounts.pc.pending,
      total: requestTypeCounts.pc.total,
      path: '/admin/requests/program-change/review',
    },
    {
      id: 'ce',
      title: 'Course Equivalency',
      icon: <Scale className="w-5 h-5 text-[#0D9488]" />,
      pending: requestTypeCounts.ce.pending,
      total: requestTypeCounts.ce.total,
      path: '/admin/history',
    },
  ];

  // Filter requests
  const filteredRequests = sampleAdminRequests.filter((req) => {
    const matchesSearch =
      searchQuery === '' ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeStatusFilter === 'All Requests' ||
      (activeStatusFilter === 'High Priority' && req.priority === 'High') ||
      req.status === activeStatusFilter;

    const matchesDept =
      activeDeptFilter === 'All Departments' || req.department === activeDeptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]/30';
      case 'Medium':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#F59E0B]/30';
      case 'Low':
        return 'bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]/30';
      default:
        return 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'Rejected':
        return 'bg-[#FEE2E2] text-[#EF4444]';
      case 'Pending Review':
      case 'In Progress':
        return 'bg-[#FEF3C7] text-[#D97706]';
      case 'Committee Review':
      case 'HOD Review':
        return 'bg-[#E0F2FE] text-[#0284C7]';
      default:
        return 'bg-[#F3F4F6] text-[#4B5563]';
    }
  };

  const handleRowAction = (req: AcademicRequest) => {
    const slug = toRequestSlug(req.id);
    if (req.type === 'Raise Capacity') {
      navigate(`/admin/requests/raise-capacity/review/${slug}`);
    } else if (req.type === 'Incomplete Exam') {
      navigate(`/admin/requests/incomplete-exam/review/${slug}`);
    } else if (req.type === 'Grade Change') {
      navigate(`/admin/requests/grade-change/review/${slug}`);
    } else if (req.type === 'Program Change') {
      navigate(`/admin/requests/program-change/review/${slug}`);
    } else {
      navigate('/admin/history');
    }
  };

  return (
    <div id="admin-dashboard-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* 4 Statistics Cards in a Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-card-admin-pending"
          icon="📋"
          iconColorClass="bg-[#FEF3C7] text-[#D97706]"
          value={adminDashboardStats.pendingRequests}
          valueColorClass="text-[#1F2937]"
          label="Total Pending Requests"
        />
        <StatCard
          id="stat-card-admin-high-priority"
          icon="⏳"
          iconColorClass="bg-[#FEE2E2] text-[#EF4444]"
          value={adminDashboardStats.highPriority}
          valueColorClass="text-[#EF4444]"
          label="High Priority"
        />
        <StatCard
          id="stat-card-admin-approved"
          icon="✅"
          iconColorClass="bg-[#D1FAE5] text-[#059669]"
          value={adminDashboardStats.approvedRequests}
          valueColorClass="text-[#059669]"
          label="Approved Requests"
        />
        <StatCard
          id="stat-card-admin-avg-time"
          icon="⏱️"
          iconColorClass="bg-[#E0F2FE] text-[#0284C7]"
          value={adminDashboardStats.avgProcessingTime}
          valueColorClass="text-[#0284C7]"
          label="Average Processing Time"
        />
      </section>

      {/* 5 Request Type Cards in a Row */}
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
          {requestTypeCards.map((card, idx) => (
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
                  {card.pending}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#1F2937] group-hover:text-[#059669] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{card.total}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Requests Management Section */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Filter Tabs Header */}
        <div className="p-5 border-b border-[#F3F4F6] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#1F2937]">Incoming Requests List</h2>
            <span className="text-xs text-[#6B7280]">
              Showing <strong className="text-[#1F2937]">8</strong> of{' '}
              <strong className="text-[#1F2937]">124</strong> requests
            </span>
          </div>

          {/* Filter Row 1 */}
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

          {/* Filter Row 2: Departments */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
            <span className="text-[#9CA3AF] text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
              Dept:
            </span>
            {deptFilters.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDeptFilter(dept)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                  activeDeptFilter === dept
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Request Type</th>
                <th className="py-3.5 px-4">Course / Program</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredRequests.map((req, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#F9FAFB]/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                    <button
                      onClick={() => handleRowAction(req)}
                      className="hover:underline focus:outline-hidden"
                    >
                      {req.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#1F2937]">{req.studentName}</p>
                    <p className="text-[11px] text-[#6B7280] font-mono">{req.studentId}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#1F2937]">{req.type}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#1F2937]">{req.courseName}</p>
                    <p className="text-[11px] text-[#6B7280] font-mono">{req.courseCode}</p>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{req.department}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadgeClass(
                        req.priority
                      )}`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{req.submittedDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${getStatusBadgeClass(
                        req.status
                      )}`}
                    >
                      {req.status}
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

        {/* Pagination */}
        <div className="p-4 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B7280]">
          <div>
            Showing <span className="font-bold text-[#1F2937]">8</span> of{' '}
            <span className="font-bold text-[#1F2937]">124</span> requests
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPageNum(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPageNum(num)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPageNum === num
                    ? 'bg-[#059669] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPageNum(Math.min(6, currentPageNum + 1))}
              disabled={currentPageNum === 6}
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
