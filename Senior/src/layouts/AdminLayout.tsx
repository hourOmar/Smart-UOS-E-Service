import React from 'react';
import { AppLayout } from './AppLayout';

interface AdminLayoutProps {
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

/**
 * Admin-specific wrapper around AppLayout. Currently only fixes
 * `role="admin"` — see StudentLayout.tsx for why there's no
 * additional configuration here yet.
 */
export const AdminLayout: React.FC<AdminLayoutProps> = (props) => {
  return <AppLayout role="admin" {...props} />;
};
