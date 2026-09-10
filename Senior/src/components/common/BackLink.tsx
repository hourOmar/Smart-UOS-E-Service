import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackLinkProps {
  id?: string;
  onClick: () => void;
  children: React.ReactNode;
  /**
   * Two visual variants exist across the app for this link — not a
   * deliberate design system, just how each feature's pages were
   * originally built:
   *  - 'tight' (Raise Capacity / Incomplete Exam pages): smaller icon
   *    gap, bottom margin, plain hover:underline.
   *  - 'wide' (Grade Change / Program Change / Course Equivalency
   *    pages): wider icon gap, hover color change, no margin.
   * Preserving both exactly rather than unifying them.
   */
  variant: 'tight' | 'wide';
}

export const BackLink: React.FC<BackLinkProps> = ({ id, onClick, children, variant }) => (
  <button
    id={id}
    onClick={onClick}
    className={
      variant === 'tight'
        ? 'inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:underline mb-2'
        : 'inline-flex items-center gap-2 text-xs font-bold text-[#059669] hover:text-[#047857] hover:underline'
    }
  >
    <ArrowLeft className="w-4 h-4" />
    <span>{children}</span>
  </button>
);
