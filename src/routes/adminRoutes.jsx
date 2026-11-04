import { Route } from 'react-router-dom';
import RoleGuard from '../components/RoleGuard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx';
import AdminOtpPage from '../pages/admin/AdminOtpPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminBatchesPage from '../pages/admin/AdminBatchesPage.jsx';
import AdminSemestersPage from '../pages/admin/AdminSemestersPage.jsx';
import AdminSubjectsPage from '../pages/admin/AdminSubjectsPage.jsx';
import AdminStudentsPage from '../pages/admin/AdminStudentsPage.jsx';
import AdminTeachingAssignmentsPage from '../pages/admin/AdminTeachingAssignmentsPage.jsx';
import AdminProgrammesPage from '../pages/admin/AdminProgrammesPage.jsx';
import AdminTimetablePage from '../pages/admin/AdminTimetablePage.jsx';
import AdminHolidaysPage from '../pages/admin/AdminHolidaysPage.jsx';
import AdminCalendarPage from '../pages/admin/AdminCalendarPage.jsx';
import AdminAttendancePage from '../pages/admin/AdminAttendancePage.jsx';
import AdminProgressPage from '../pages/admin/AdminProgressPage.jsx';
import AdminAuditLogPage from '../pages/admin/AdminAuditLogPage.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';

const adminRoutes = (
  <Route path="admin">
    <Route path="login" element={<AdminLoginPage />} />
    <Route path="login/verify-otp" element={<AdminOtpPage />} />
    <Route path="verify-otp" element={<AdminOtpPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage role="admin" />} />
    <Route path="reset-password" element={<ResetPasswordPage role="admin" />} />
    <Route
      path="dashboard"
      element={
        <RoleGuard role="admin">
          <AdminLayout />
        </RoleGuard>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="programmes" element={<AdminProgrammesPage />} />
      <Route path="batches" element={<AdminBatchesPage />} />
      <Route path="semesters" element={<AdminSemestersPage />} />
      <Route path="subjects" element={<AdminSubjectsPage />} />
      <Route path="students" element={<AdminStudentsPage />} />
      <Route path="teaching-assignments" element={<AdminTeachingAssignmentsPage />} />
      <Route path="timetable" element={<AdminTimetablePage />} />
      <Route path="holidays" element={<AdminHolidaysPage />} />
      <Route path="calendar" element={<AdminCalendarPage />} />
      <Route path="attendance" element={<AdminAttendancePage />} />
      <Route path="progress" element={<AdminProgressPage />} />
      <Route path="audit-logs" element={<AdminAuditLogPage />} />
    </Route>
  </Route>
);

export default adminRoutes;
