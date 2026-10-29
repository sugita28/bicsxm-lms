import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout.jsx';
import RoleGuard from './components/RoleGuard.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Courses from './pages/Courses.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminOtpPage from './pages/admin/AdminOtpPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import PendingApprovalPage from './pages/auth/PendingApprovalPage.jsx';
import RejectedPage from './pages/auth/RejectedPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import VerifyEmailPage from './pages/auth/VerifyEmailPage.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import TeacherDashboard from './pages/teacher/TeacherDashboard.jsx';
import ServerErrorPage from './pages/errors/ServerErrorPage';
import { useAuthStore } from './store/authStore';

export default function App() {
  const hydrateAll = useAuthStore((state) => state.hydrateAll);

  useEffect(() => {
    // Hydrate existing sessions across student, teacher, and admin concurrently on load
    hydrateAll();
  }, [hydrateAll]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Universal Top-Level Auth Routes */}
        <Route path="login" element={<LoginPage role="student" />} />
        <Route path="signup" element={<SignupPage role="student" />} />

        {/* Student Auth Routes */}
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

        {/* Teacher Auth Routes */}
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

        {/* Admin Auth and Protected Dashboard Routes */}
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
        
        
        
         {/* Server Error Page (502) */}
        <Route path="502" element={<ServerErrorPage />} />

         
        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}