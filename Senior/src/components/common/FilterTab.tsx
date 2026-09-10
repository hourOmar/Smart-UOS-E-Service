import React from 'react';

interface FilterTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  /**
   * Two visual variants exist for the inactive state:
   *  - 'plain' (AdminCourseDetailsPage, AdminRaiseCapacityDashboard):
   *    bg-[#F9FAFB], no border.
   *  - 'bordered' (AdminHistoryPage, StudentHistoryPage): bg-white
   *    with a visible border.
   * Preserving both exactly rather than unifying them.
   */
  variant: 'plain' | 'bordered';
  /** 'bordered' variant only: styles this tab as a destructive "Clear Filters" pill instead of a normal filter. */
  clear?: boolean;
}

/**
 * The pill-style filter tab repeated across course/section/history
 * list pages (4 identical usages before this extraction, excluding
 * AdminDashboard which uses different padding — a real visual
 * difference, not unified here).
 */
export const FilterTab: React.FC<FilterTabProps> = ({ label, active, onClick, variant, clear }) => {
  const inactiveClass =
    variant === 'plain'
      ? 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F3F4F6]'
      : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6]';

  const stateClass = clear
    ? 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#FEE2E2] hover:text-[#EF4444]'
    : active
    ? 'bg-[#059669] text-white shadow-xs'
    : inactiveClass;

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${stateClass}`}
    >
      {label}
    </button>
  );
};
