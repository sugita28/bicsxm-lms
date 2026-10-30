import { Route } from 'react-router-dom';
import RoleGuard from '../components/RoleGuard.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import PendingApprovalPage from '../pages/auth/PendingApprovalPage.jsx';
import RejectedPage from '../pages/auth/RejectedPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage.jsx';
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx';

const teacherRoutes = (
  <Route path="teacher">
    <Route path="login" element={<LoginPage role="teacher" />} />
    <Route path="signup" element={<SignupPage role="teacher" />} />
    <Route path="verify-email" element={<VerifyEmailPage role="teacher" />} />
    <Route path="forgot-password" element={<ForgotPasswordPage role="teacher" />} />
    <Route path="reset-password" element={<ResetPasswordPage role="teacher" />} />
    <Route path="pending-approval" element={<PendingApprovalPage />} />
    <Route path="rejected" element={<RejectedPage />} />
    <Route
      path="dashboard"
      element={
        <RoleGuard role="teacher">
          <TeacherDashboard />
        </RoleGuard>
      }
    />
  </Route>
);

export default teacherRoutes;