import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HistoryStatusBadgeProps {
  status: string;
}

/**
 * Status pill shared by the history-card grids in AdminHistoryPage
 * and StudentHistoryPage (identical wrapper classes/icon size before
 * this extraction). AdminHistoryPage's mock data only ever contains
 * 'Approved'/'Rejected' (verified), so using this component's 3-way
 * logic there produces byte-identical output to its previous 2-way
 * check — the amber/Clock branch simply never triggers for that page.
 *
 * Distinct from src/components/common/StatusBadge.tsx: that one uses
 * a smaller size (text-[11px], px-2.5, w-3 icon) for dashboard/table
 * contexts; this one is sized for the larger history card grid
 * (text-xs, px-3, w-3.5 icon) — kept separate rather than unified, to
 * avoid changing either page's visual size.
 */
export const HistoryStatusBadge: React.FC<HistoryStatusBadgeProps> = ({ status }) => {
  const colorClass =
    status === 'Approved'
      ? 'bg-[#D1FAE5] text-[#059669]'
      : status === 'Rejected'
      ? 'bg-[#FEE2E2] text-[#EF4444]'
      : 'bg-[#FEF3C7] text-[#D97706]';

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 inline-flex items-center gap-1 ${colorClass}`}
    >
      {status === 'Approved' ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : status === 'Rejected' ? (
        <XCircle className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      {status}
    </span>
  );
};
