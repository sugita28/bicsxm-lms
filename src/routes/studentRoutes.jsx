import { Route } from 'react-router-dom';
import RoleGuard from '../components/RoleGuard.jsx';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx';
import SignupPage from '../pages/auth/SignupPage.jsx';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage.jsx';
import StudentDashboard from '../pages/student/StudentDashboard.jsx';

const studentRoutes = (
  <Route path="student">
    <Route path="login" element={<LoginPage role="student" />} />
    <Route path="signup" element={<SignupPage role="student" />} />
    <Route path="verify-email" element={<VerifyEmailPage role="student" />} />
    <Route path="forgot-password" element={<ForgotPasswordPage role="student" />} />
    <Route path="reset-password" element={<ResetPasswordPage role="student" />} />
    <Route
      path="dashboard"
      element={
        <RoleGuard role="student">
          <StudentDashboard />
        </RoleGuard>
      }
    />
  </Route>
);

export default studentRoutes;