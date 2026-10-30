import { Route } from 'react-router-dom';
import RoleGuard from '../components/RoleGuard.jsx';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx';
import AdminOtpPage from '../pages/admin/AdminOtpPage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
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
    </Route>
  </Route>
);

export default adminRoutes;