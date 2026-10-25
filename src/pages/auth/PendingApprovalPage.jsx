import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { teacherApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import { useAuthStore } from '../../store/authStore';

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleCheckStatus = async () => {
    setIsChecking(true);
    try {
      // First refresh token in case status was updated on backend
      const refreshRes = await teacherApi.post('/auth/token/refresh/');
      const newStatus = refreshRes.data.status;
      const newScope = refreshRes.data.scope;

      setAuth('teacher', { status: newStatus, scope: newScope });

      if (newStatus === 'ACTIVE' && newScope === 'full') {
        toast.success('Congratulations! Your instructor application has been approved.');
        navigate('/teacher/dashboard');
      } else if (newStatus === 'REJECTED') {
        toast.error('Your application has been reviewed and was not accepted.');
        navigate('/teacher/rejected');
      } else {
        toast.info('Your application is still pending administrator review.');
      }
    } catch {
      // If refresh fails, try me endpoint
      try {
        const meRes = await teacherApi.get('/auth/me/');
        if (meRes.data.status === 'ACTIVE') {
          navigate('/teacher/dashboard');
        } else {
          toast.info('Application is still pending review.');
        }
      } catch {
        toast.error('Could not check status. Please try again.');
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout('teacher');
    navigate('/teacher/login');
  };

  return (
    <AuthLayout
      role="teacher"
      title="Application Under Review"
      subtitle="Thank you for applying to teach at LMS Academy"
    >
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef3c7',
            color: '#b45309',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-raised-sm)',
          }}
        >
          <Clock size={32} />
        </div>

        <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
          Your instructor account has been created and your email is verified. An administrator is currently reviewing your profile. You will receive an email as soon as a decision is made.
        </p>

        <ClayButton
          onClick={handleCheckStatus}
          loading={isChecking}
          style={{ marginBottom: '1rem' }}
        >
          <RefreshCw size={18} />
          {isChecking ? 'Checking status...' : 'Check Status Now'}
        </ClayButton>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </AuthLayout>
  );
}
