import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserRole } from '../types';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';

interface AppLayoutProps {
  role: UserRole;
  onLogout: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

/**
 * Shared visual shell: Sidebar + Header + main content area + toast
 * banner. Nested routes render into `<Outlet/>` — this component owns
 * no route definitions and no page-switch logic, only the chrome
 * around whichever route matched.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  role,
  onLogout,
  searchValue,
  onSearchChange,
  toastMessage,
  onDismissToast,
}) => {
  return (
    <div className="flex h-screen bg-[#F3F4F6] text-[#1F2937] font-sans antialiased overflow-hidden selection:bg-[#059669] selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#1F2937] text-white text-xs px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-slide-in">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{toastMessage}</span>
          <button
            onClick={onDismissToast}
            className="ml-2 text-white/60 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Persistent Role-Based Sidebar */}
      <Sidebar role={role} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header role={role} searchValue={searchValue} onSearchChange={onSearchChange} />

        {/* Routed Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
