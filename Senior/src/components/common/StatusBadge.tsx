import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  /** Exact label to show for anything that isn't 'Approved' or 'Rejected' (varies by call site: "In Progress", "Pending Review", ...). */
  fallbackLabel: string;
}

/**
 * Small icon + pill status badge shared by StudentDashboard and
 * AdminCourseDetailsPage (byte-identical markup before this
 * extraction, aside from the fallback label text).
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, fallbackLabel }) => {
  if (status === 'Approved') {
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#059669] inline-flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Approved
      </span>
    );
  }
  if (status === 'Rejected') {
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#EF4444] inline-flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Rejected
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] inline-flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {fallbackLabel}
    </span>
  );
};
