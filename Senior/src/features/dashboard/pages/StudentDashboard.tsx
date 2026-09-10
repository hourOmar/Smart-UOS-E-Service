import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Scale,
  PlusCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { defaultStudentProfile } from '../../../mocks/students.mock';
import { studentDashboardStats } from '../../../mocks/dashboard.mock';
import { sampleStudentRequests } from '../../../mocks/requests.mock';
import { StatCard } from '../../../components/common/StatCard';
import { StatusBadge } from '../../../components/common/StatusBadge';

interface StudentDashboardProps {
  /**
   * PLACEHOLDER — FUTURE SOURCE TBD (bug #2, see Phase 5 report)
   *
   * Made optional rather than fixed: this prop was declared as
   * required, but App.tsx never supplied it, and no "new request type"
   * modal exists anywhere in the codebase for it to open — the "New
   * Request" banner button below has always been a no-op. This looks
   * like intended-but-never-built functionality, not dead/obsolete
   * code, so a modal was NOT invented here. Making the prop optional
   * only makes the button's current (inert) behavior type-correct;
   * it does not change what a user can do.
   * TODO: Product decision needed — build the picker modal, remove
   * the button, or leave it deferred.
   */
  onOpenNewRequestModal?: () => void;
  searchQuery: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenNewRequestModal,
  searchQuery,
}) => {
  const navigate = useNavigate();
  // Static frontend configuration (title/icon/route target). Unlike the
  // admin dashboard, these cards do not display pending/total counts.
  //
  // PLACEHOLDER — FUTURE SOURCE TBD
  // The `eta` and `badge` ("Active") values below are not backed by any
  // established data source yet. They may end up being a fixed SLA/
  // policy constant per request type, or an admin-configurable
  // "currently accepting submissions" flag from the backend.
  // TODO: Confirm with the project domain design what should generate
  // these values. Do not assume either classification.
  const requestTypes = [
    {
      id: 'rc',
      title: 'Raise Capacity',
      icon: <TrendingUp className="w-5 h-5 text-[#059669]" />,
      eta: '[1-2 days]',
      badge: 'Active',
      path: '/student/requests/raise-capacity',
    },
    {
      id: 'ie',
      title: 'Incomplete Exam',
      icon: <FileText className="w-5 h-5 text-[#0284C7]" />,
      eta: '[3-5 days]',
      badge: 'Active',
      path: '/student/requests/incomplete-exam',
    },
    {
      id: 'gc',
      title: 'Grade Change',
      icon: <BarChart3 className="w-5 h-5 text-[#F59E0B]" />,
      eta: '[5-7 days]',
      badge: 'Active',
      path: '/student/requests/grade-change',
    },
    {
      id: 'pc',
      title: 'Program Change',
      icon: <RefreshCw className="w-5 h-5 text-[#8B5CF6]" />,
      eta: '[7-10 days]',
      badge: 'Active',
      path: '/student/requests/program-change',
    },
    {
      id: 'ce',
      title: 'Course Equivalency',
      icon: <Scale className="w-5 h-5 text-[#0D9488]" />,
      eta: '[10-14 days]',
      badge: 'Active',
      path: '/student/requests/course-equivalency',
    },
  ];

  const filteredRequests = sampleStudentRequests.filter((req) => {
    if (!searchQuery) return true;
    return (
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="student-dashboard-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Welcome Banner matching login card header gradient */}
      <section
        id="student-welcome-banner"
        className="bg-gradient-to-r from-[#059669] to-[#10B981] p-6 sm:p-7 rounded-[20px] shadow-md text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
              Active Term: [Spring 2026]
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Welcome back, {defaultStudentProfile.name}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
            You have <strong className="font-bold underline decoration-white/50">{studentDashboardStats.pending}</strong> pending requests that need attention.
          </p>
        </div>

        <button
          id="student-banner-new-request-btn"
          onClick={onOpenNewRequestModal}
          className="relative z-10 shrink-0 py-2.5 px-5 rounded-xl bg-white hover:bg-[#F9FAFB] active:scale-98 text-[#059669] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-[#059669]" />
          <span>New Request</span>
        </button>
      </section>

      {/* 4 Statistics Cards in a Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-card-student-total"
          icon="📝"
          iconColorClass="bg-[#F3F4F6] text-[#4B5563]"
          value={studentDashboardStats.totalRequests}
          valueColorClass="text-[#1F2937]"
          label="Total Requests"
        />
        <StatCard
          id="stat-card-student-pending"
          icon="⏳"
          iconColorClass="bg-[#FEF3C7] text-[#D97706]"
          value={studentDashboardStats.pending}
          valueColorClass="text-[#D97706]"
          label="Pending"
        />
        <StatCard
          id="stat-card-student-approved"
          icon="✅"
          iconColorClass="bg-[#D1FAE5] text-[#059669]"
          value={studentDashboardStats.approved}
          valueColorClass="text-[#059669]"
          label="Approved"
        />
        <StatCard
          id="stat-card-student-rejected"
          icon="❌"
          iconColorClass="bg-[#FEE2E2] text-[#EF4444]"
          value={studentDashboardStats.rejected}
          valueColorClass="text-[#EF4444]"
          label="Rejected"
        />
      </section>

      {/* 5 Request Types Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#1F2937] tracking-tight">
              Request Types
            </h2>
            <span className="text-xs text-[#6B7280]">
              (Select a service to start)
            </span>
          </div>
          <button
            onClick={() => navigate('/student/history')}
            className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {requestTypes.map((type) => (
            <div
              key={type.id}
              id={`student-request-type-${type.id}`}
              onClick={() => navigate(type.path)}
              className="bg-white p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#059669] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-[#F3F4F6] group-hover:bg-[#D1FAE5]/60 transition-colors">
                  {type.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#059669]">
                  {type.badge}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-xs text-[#1F2937] group-hover:text-[#059669] transition-colors">
                  {type.title}
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">ETA: {type.eta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Requests Table */}
      <section className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F3F4F6] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#1F2937]">Recent Requests</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Track your submitted academic petitions</p>
          </div>
          <button
            onClick={() => navigate('/student/history')}
            className="text-xs font-semibold text-[#059669] hover:underline"
          >
            View History →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Request Type</th>
                <th className="py-3.5 px-4">Course Number</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredRequests.map((req, index) => (
                <tr key={index} className="hover:bg-[#F9FAFB]/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#059669]">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#1F2937]">
                    {req.type}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#1F2937]">{req.courseName}</span>
                    <span className="text-[11px] text-[#6B7280] block font-mono">
                      {req.courseCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{req.submittedDate}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={req.status} fallbackLabel="In Progress" /></td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{req.lastUpdated || 'Mar 16, 2026'}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate('/student/history')}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F3F4F6] text-[#4B5563] text-xs font-semibold inline-flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
