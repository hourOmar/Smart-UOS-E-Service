import React from 'react';
import { AppLayout } from './AppLayout';

interface StudentLayoutProps {
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

/**
 * Student-specific wrapper around AppLayout. Currently only fixes
 * `role="student"` — Sidebar/Header already branch on `role`
 * internally for student-specific labels/widths, so there is no
 * additional student-only configuration to own here yet.
 */
export const StudentLayout: React.FC<StudentLayoutProps> = (props) => {
  return <AppLayout role="student" {...props} />;
};
