import React, { useState } from 'react';
import { Search, Bell, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { UserRole } from '../../types';
import { studentNotifications, adminNotifications } from '../../mocks/notifications.mock';

interface HeaderProps {
  role: UserRole;
  /**
   * PLACEHOLDER — FUTURE SOURCE TBD (bug #1, see Phase 5 report)
   *
   * Optional rather than required: App.tsx has never computed a
   * value for these (there's no per-page title/subtitle mapping
   * anywhere in the codebase), so they've always rendered blank.
   * Making them optional makes that existing (blank) behavior
   * type-correct instead of inventing 21 pages' worth of title text.
   * TODO: A natural fit once Phase 6 gives each page a real route —
   * route metadata is a much more obvious place to hang a page title.
   */
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  title,
  subtitle,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const isStudent = role === 'student';
  const badgeCount = isStudent ? studentNotifications.unreadCount : adminNotifications.unreadCount;
  const notifications = isStudent ? studentNotifications.items : adminNotifications.items;

  return (
    <header
      id="portal-top-header"
      className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-20 shadow-xs"
    >
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#1F2937] tracking-tight">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-[#6B7280] mt-0.5">{subtitle}</p>
      </div>

      {/* Right Controls: Search + Notification */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 md:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="header-search-input"
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="header-notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937] transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span
              id="header-notification-badge"
              className="absolute -top-1.5 -right-1.5 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs ring-2 ring-white"
            >
              {badgeCount}
            </span>
          </button>

          {/* Notification Popover Dropdown */}
          {showNotifications && (
            <div
              id="header-notifications-dropdown"
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#1F2937]">Notifications</span>
                  <span className="bg-[#FEE2E2] text-[#EF4444] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badgeCount} New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#9CA3AF] hover:text-[#4B5563] text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-[#F3F4F6] max-h-64 overflow-y-auto my-2">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                    {n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    ) : n.type === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1F2937]">{n.title}</p>
                      <p className="text-[11px] text-[#6B7280] leading-relaxed">{n.desc}</p>
                      <span className="text-[10px] text-[#9CA3AF] mt-1 inline-block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F3F4F6] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-[#059669] hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
