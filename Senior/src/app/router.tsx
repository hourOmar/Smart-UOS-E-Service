import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../types';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { AdminDashboard } from '../features/dashboard/pages/AdminDashboard';
import { StudentDashboard } from '../features/dashboard/pages/StudentDashboard';
import { AdminHistoryPage } from '../features/request-history/pages/AdminHistoryPage';
import { StudentHistoryPage } from '../features/request-history/pages/StudentHistoryPage';
import { SettingsPage } from '../features/settings/pages/SettingsPage';
import { ProfilePage } from '../features/settings/pages/ProfilePage';
import { StudentRaiseCapacityForm } from '../features/raise-capacity/pages/StudentRaiseCapacityForm';
import { AdminRaiseCapacityDashboard } from '../features/raise-capacity/pages/AdminRaiseCapacityDashboard';
import { AdminCourseDetailsPage } from '../features/raise-capacity/pages/AdminCourseDetailsPage';
import { AdminRaiseCapacityReviewPage } from '../features/raise-capacity/pages/AdminRaiseCapacityReviewPage';
import { StudentIncompleteExamForm } from '../features/incomplete-exam/pages/StudentIncompleteExamForm';
import { AdminIncompleteExamReviewPage } from '../features/incomplete-exam/pages/AdminIncompleteExamReviewPage';
import { RequestSuccessPage } from '../features/requests/components/RequestSuccessPage';
import { StudentGradeReviewPage } from '../features/grade-change/pages/StudentGradeReviewPage';
import { AdminGradeChangeReviewPage } from '../features/grade-change/pages/AdminGradeChangeReviewPage';
import { StudentCourseEquivalencyPage } from '../features/course-equivalency/pages/StudentCourseEquivalencyPage';
import { StudentProgramChangeCollegesPage } from '../features/program-change/pages/StudentProgramChangeCollegesPage';
import { StudentProgramChangeMajorsPage } from '../features/program-change/pages/StudentProgramChangeMajorsPage';
import { AdminProgramChangeReviewPage } from '../features/program-change/pages/AdminProgramChangeReviewPage';

import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// AdminProgrammingSectionPage.tsx existed in the original generated
// frontend, was never reachable through navigation, and was deleted
// in Phase 9 after a careful comparison confirmed it was fully
// redundant with AdminCourseDetailsPage.tsx — same course, same
// student-petition table shape, same workflow, but without the
// bug #4 request-identity fix that page has. No route was ever added
// for it and none should be.

interface RequireRoleProps {
  role: UserRole | null;
  allow: UserRole;
}

/**
 * Smallest route protection needed for this temporary/simulated auth:
 * an unauthenticated visitor is sent to /login; a logged-in user of
 * the wrong role is sent to their own dashboard rather than shown the
 * other role's pages. Not real authorization — see LoginPage.tsx for
 * the TEMPORARY AUTHENTICATION notice this defers to.
 */
const RequireRole: React.FC<RequireRoleProps> = ({ role, allow }) => {
  if (!role) return <Navigate to="/login" replace />;
  if (role !== allow) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }
  return <Outlet />;
};

interface AppRoutesProps {
  role: UserRole | null;
  onLogin: (role: UserRole, email?: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
  onToast: (msg: string) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  role,
  onLogin,
  onLogout,
  searchQuery,
  onSearchChange,
  toastMessage,
  onDismissToast,
  onToast,
}) => {
  const dashboardPath = role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <Routes>
      <Route
        path="/login"
        element={
          role ? (
            <Navigate to={dashboardPath} replace />
          ) : (
            <LoginPage onLogin={onLogin} onLoginSuccess={onLogin} />
          )
        }
      />

      {/* Student */}
      <Route element={<RequireRole role={role} allow="student" />}>
        <Route
          path="/student"
          element={
            <StudentLayout
              onLogout={onLogout}
              searchValue={searchQuery}
              onSearchChange={onSearchChange}
              toastMessage={toastMessage}
              onDismissToast={onDismissToast}
            />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard searchQuery={searchQuery} />} />
          <Route path="history" element={<StudentHistoryPage searchQuery={searchQuery} />} />
          <Route path="settings" element={<SettingsPage role="student" onToast={onToast} />} />
          <Route path="profile" element={<ProfilePage role="student" onToast={onToast} />} />
          <Route
            path="requests/raise-capacity"
            element={<StudentRaiseCapacityForm onToast={onToast} />}
          />
          <Route
            path="requests/incomplete-exam"
            element={<StudentIncompleteExamForm onToast={onToast} />}
          />
          <Route
            path="requests/grade-change"
            element={<StudentGradeReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/course-equivalency"
            element={<StudentCourseEquivalencyPage onToast={onToast} />}
          />
          <Route path="requests/program-change" element={<StudentProgramChangeCollegesPage />} />
          <Route
            path="requests/program-change/:collegeId/majors"
            element={<StudentProgramChangeMajorsPage onToast={onToast} />}
          />
          <Route path="requests/success" element={<RequestSuccessPage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<RequireRole role={role} allow="admin" />}>
        <Route
          path="/admin"
          element={
            <AdminLayout
              onLogout={onLogout}
              searchValue={searchQuery}
              onSearchChange={onSearchChange}
              toastMessage={toastMessage}
              onDismissToast={onDismissToast}
            />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard searchQuery={searchQuery} />} />
          <Route path="history" element={<AdminHistoryPage searchQuery={searchQuery} />} />
          <Route path="settings" element={<SettingsPage role="admin" onToast={onToast} />} />
          <Route path="profile" element={<ProfilePage role="admin" onToast={onToast} />} />
          <Route
            path="requests/raise-capacity"
            element={<AdminRaiseCapacityDashboard searchQuery={searchQuery} />}
          />
          <Route
            path="requests/raise-capacity/courses/:courseCode"
            element={<AdminCourseDetailsPage onToast={onToast} />}
          />
          <Route
            path="requests/raise-capacity/review"
            element={<AdminRaiseCapacityReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/raise-capacity/review/:requestId"
            element={<AdminRaiseCapacityReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/incomplete-exam/review"
            element={<AdminIncompleteExamReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/incomplete-exam/review/:requestId"
            element={<AdminIncompleteExamReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/grade-change/review"
            element={<AdminGradeChangeReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/grade-change/review/:requestId"
            element={<AdminGradeChangeReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/program-change/review"
            element={<AdminProgramChangeReviewPage onToast={onToast} />}
          />
          <Route
            path="requests/program-change/review/:requestId"
            element={<AdminProgramChangeReviewPage onToast={onToast} />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={role ? dashboardPath : '/login'} replace />} />
      <Route path="*" element={<Navigate to={role ? dashboardPath : '/login'} replace />} />
    </Routes>
  );
};
