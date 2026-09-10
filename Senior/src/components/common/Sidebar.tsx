import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  History,
  Settings,
  LogOut,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';
import { defaultStudentProfile } from '../../mocks/students.mock';
import { defaultAdminProfile } from '../../mocks/admins.mock';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  onOpenNewRequestModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  onLogout,
  onOpenNewRequestModal,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isStudent = role === 'student';
  const base = isStudent ? '/student' : '/admin';
  const widthClass = isStudent ? 'w-full md:w-[306px]' : 'w-full md:w-[280px]';

  const isDashboardActive = pathname === `${base}/dashboard`;

  // Preserves the original (pre-routing) behavior exactly: only
  // Raise Capacity and Incomplete Exam pages light up "Requests" for
  // either role — Grade Change/Course Equivalency/Program Change
  // never did, even before this migration.
  const isRequestsActive =
    pathname.startsWith(`${base}/requests/raise-capacity`) ||
    pathname.startsWith(`${base}/requests/incomplete-exam`);

  const isHistoryActive = pathname === `${base}/history`;
  const isSettingsActive = pathname === `${base}/settings`;
  const isProfileActive = pathname === `${base}/profile`;

  return (
    <aside
      id="portal-sidebar"
      className={`${widthClass} shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col justify-between p-5 min-h-screen select-none`}
    >
      <div className="flex flex-col gap-6">
        {/* Top Logo & Portal Title */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-[#F3F4F6]">
          <div
            id="sidebar-logo-badge"
            onClick={() => navigate(`${base}/dashboard`)}
            className="w-[52px] h-[52px] rounded-[16px] bg-[#059669] flex items-center justify-center text-white font-black text-xl shadow-md cursor-pointer hover:opacity-95 transition-all"
          >
            UoS
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-[#1F2937] tracking-tight">
                University Portal
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]"></span>
            </div>
            <p className="text-xs text-[#6B7280]">
              {isStudent ? 'Student Academic Hub' : 'Academic Admin Console'}
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div
          id="sidebar-profile-card"
          onClick={() => navigate(`${base}/profile`)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            isProfileActive
              ? 'bg-[#D1FAE5]/40 border-[#10B981]/50 shadow-sm'
              : 'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-[#F3F4F6]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#D1FAE5]">
              {isStudent ? defaultStudentProfile.initials : defaultAdminProfile.initials}
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="font-semibold text-xs text-[#1F2937] truncate">
                {isStudent ? defaultStudentProfile.name : defaultAdminProfile.name}
              </h4>
              <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                {isStudent
                  ? `ID: ${defaultStudentProfile.id} | ${defaultStudentProfile.department}`
                  : defaultAdminProfile.role}
              </p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E5E7EB]/60 flex items-center justify-between text-[11px] font-medium text-[#059669]">
            <span>View Full Profile</span>
            <span className="text-xs">›</span>
          </div>
        </div>

        {/* Quick Action Button for Student */}
        {isStudent && onOpenNewRequestModal && (
          <button
            id="sidebar-new-request-quick-btn"
            onClick={onOpenNewRequestModal}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#10B981] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Request</span>
          </button>
        )}

        {/* Navigation Section */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-3 mb-1">
            Menu Navigation
          </p>

          {/* Dashboard */}
          <button
            id="sidebar-nav-dashboard"
            onClick={() => navigate(`${base}/dashboard`)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isDashboardActive
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard
                className={`w-4 h-4 ${
                  isDashboardActive ? 'text-white' : 'text-[#6B7280]'
                }`}
              />
              <span>Dashboard</span>
            </div>
          </button>

          {/*
            PLACEHOLDER DASHBOARD METRIC
            The "[4]"/"[24]" badge count below is an inline literal.
            TODO: Replace with a backend-calculated request count.
            Future source: FastAPI backend-calculated endpoint.
            Persistence: TBD — backend persistence decision.
          */}
          {/* Requests Tab (All Requests for Admin / My Requests for Student) */}
          <button
            id="sidebar-nav-requests"
            onClick={() =>
              navigate(isStudent ? `${base}/dashboard` : `${base}/requests/raise-capacity`)
            }
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isRequestsActive
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet
                className={`w-4 h-4 ${
                  isRequestsActive ? 'text-white' : 'text-[#6B7280]'
                }`}
              />
              <span>{isStudent ? 'My Requests' : 'All Requests'}</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isRequestsActive
                  ? 'bg-white text-[#059669]'
                  : 'bg-[#EF4444] text-white'
              }`}
            >
              {isStudent ? '[4]' : '[24]'}
            </span>
          </button>

          {/* Request History */}
          <button
            id="sidebar-nav-history"
            onClick={() => navigate(`${base}/history`)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isHistoryActive
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <History
                className={`w-4 h-4 ${
                  isHistoryActive ? 'text-white' : 'text-[#6B7280]'
                }`}
              />
              <span>History</span>
            </div>
          </button>

          {/* Settings */}
          <button
            id="sidebar-nav-settings"
            onClick={() => navigate(`${base}/settings`)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isSettingsActive
                ? 'bg-[#059669] text-white shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings
                className={`w-4 h-4 ${
                  isSettingsActive ? 'text-white' : 'text-[#6B7280]'
                }`}
              />
              <span>Settings</span>
            </div>
          </button>
        </div>

        {/*
          PLACEHOLDER — FUTURE SOURCE TBD
          The active semester and withdrawal deadline below could be a
          low-frequency admin-maintained "academic terms" record via
          FastAPI (persistence: TBD — backend persistence decision),
          or a legitimate static constant updated manually per term.
          Not confirmed either way.
          TODO: Confirm with the project domain design.
        */}
        {/* Quick Info / University Links */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-3 rounded-xl text-[11px] text-[#166534]">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            Academic Term
          </p>
          <p className="text-[#374151]">
            Active Semester: <strong className="text-[#059669]">[Spring 2026]</strong>
          </p>
          <p className="text-[#6B7280] text-[10px] mt-0.5">
            Withdrawal Deadline: [Mar 26, 2026]
          </p>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-[#F3F4F6] flex flex-col gap-2">
        <button
          id="sidebar-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#EF4444] hover:bg-[#FEE2E2]/60 transition-all"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] bg-[#FEE2E2] px-1.5 py-0.5 rounded text-[#B91C1C]">
            {isStudent ? 'Student' : 'Admin'}
          </span>
        </button>
      </div>
    </aside>
  );
};
