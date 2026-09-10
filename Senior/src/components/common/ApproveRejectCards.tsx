import React from 'react';

interface ApproveRejectCardsProps {
  /** Radio group name — must be unique per form on the page. */
  name: string;
  decision: 'approve' | 'reject';
  onChange: (decision: 'approve' | 'reject') => void;
  approveTitle: string;
  approveDescription: string;
  rejectTitle: string;
  rejectDescription: string;
}

/**
 * The two-column approve/reject radio-card pair shared by
 * AdminRaiseCapacityReviewPage and AdminIncompleteExamReviewPage
 * (identical structure/classes before this extraction; only the
 * labels, descriptions, and radio group name differ). Note: Grade
 * Change and Program Change review pages use a visually different
 * button-toggle pattern, not this one — not unified here.
 */
export const ApproveRejectCards: React.FC<ApproveRejectCardsProps> = ({
  name,
  decision,
  onChange,
  approveTitle,
  approveDescription,
  rejectTitle,
  rejectDescription,
}) => (
  <div className="grid grid-cols-2 gap-4">
    <label
      className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
        decision === 'approve'
          ? 'bg-[#F0FDF4] border-[#059669] ring-2 ring-[#059669]/20'
          : 'bg-[#F9FAFB] border-[#E5E7EB]'
      }`}
    >
      <input
        type="radio"
        name={name}
        value="approve"
        checked={decision === 'approve'}
        onChange={() => onChange('approve')}
        className="accent-[#059669] w-4 h-4"
      />
      <div>
        <span className="font-bold text-xs text-[#1F2937] block">{approveTitle}</span>
        <span className="text-[11px] text-[#6B7280]">{approveDescription}</span>
      </div>
    </label>

    <label
      className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
        decision === 'reject'
          ? 'bg-[#FEF2F2] border-[#EF4444] ring-2 ring-[#EF4444]/20'
          : 'bg-[#F9FAFB] border-[#E5E7EB]'
      }`}
    >
      <input
        type="radio"
        name={name}
        value="reject"
        checked={decision === 'reject'}
        onChange={() => onChange('reject')}
        className="accent-[#EF4444] w-4 h-4"
      />
      <div>
        <span className="font-bold text-xs text-[#1F2937] block">{rejectTitle}</span>
        <span className="text-[11px] text-[#6B7280]">{rejectDescription}</span>
      </div>
    </label>
  </div>
);
