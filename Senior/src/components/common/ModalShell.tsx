import React from 'react';

interface ModalShellProps {
  children: React.ReactNode;
  /** Tailwind border class for the inner card, e.g. "border-[#E5E7EB]" (default) or "border-[#EF4444]/30" (a warning/delete modal). */
  borderColorClass?: string;
}

/**
 * The overlay + centered white card shell repeated across
 * SettingsPage (change password / delete account), StudentHistoryPage
 * and AdminHistoryPage (request detail popovers) — 4 identical
 * usages before this extraction. Each caller supplies its own header/
 * body/footer as children; this component owns only the shell.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  children,
  borderColorClass = 'border-[#E5E7EB]',
}) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className={`bg-white rounded-2xl p-6 max-w-md w-full border ${borderColorClass} shadow-2xl`}>
      {children}
    </div>
  </div>
);
