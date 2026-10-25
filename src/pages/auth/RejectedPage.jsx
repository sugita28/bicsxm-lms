import { LogOut, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuthStore } from '../../store/authStore';

export default function RejectedPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout('teacher');
    navigate('/teacher/login');
  };

  return (
    <AuthLayout
      role="teacher"
      title="Application Status"
      subtitle="Instructor application review result"
    >
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#b91c1c',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-raised-sm)',
          }}
        >
          <XCircle size={32} />
        </div>

        <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
          We appreciate your interest in teaching at LMS Academy. After careful review, our administration team has decided not to approve your instructor application at this time.
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 2rem' }}>
          If you believe this was in error, please contact support at{' '}
          <a href="mailto:support@lms.local" style={{ color: 'var(--accent)' }}>
            support@lms.local
          </a>
          .
        </p>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontWeight: '600',
            fontSize: '0.95rem',
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
