import { Award, CheckCircle, LogOut, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { teacherApi } from '../../api';
import ClayButton from '../../components/auth/ClayButton';
import StatusBadge from '../../components/auth/StatusBadge';
import { useAuthStore } from '../../store/authStore';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, status } = useAuthStore((state) => state.teacher || {});
  const logout = useAuthStore((state) => state.logout);
  const [pingData, setPingData] = useState(null);
  const [loadingPing, setLoadingPing] = useState(true);

  const fetchPing = async () => {
    try {
      const res = await teacherApi.get('/dashboard/ping/');
      setPingData(res.data);
    } catch {
      toast.error('Failed to ping instructor dashboard endpoint.');
    } finally {
      setLoadingPing(false);
    }
  };

  useEffect(() => {
    fetchPing();
  }, []);

  const handleLogout = async () => {
    await logout('teacher');
    navigate('/teacher/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '2.5rem 1.5rem', fontFamily: 'var(--font-display, Figtree, sans-serif)' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Header card */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg, 28px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--accent, #2f55ff)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-clay-accent)',
              }}
            >
              <Award size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text)' }}>
                  {user?.full_name || 'Instructor'}
                </h1>
                <StatusBadge status={status || 'ACTIVE'} />
              </div>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {user?.email || 'Instructor Portal'} &bull; Department: {user?.profile?.department || 'General'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--r-full, 9999px)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--danger, #b3342a)',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Dashboard Proof Ping Card */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg, 28px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle size={22} style={{ color: 'var(--success, #1f8a5b)' }} />
              <h2 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>
                Protected Instructor API Ping Proof
              </h2>
            </div>
            <ClayButton
              variant="secondary"
              fullWidth={false}
              loading={loadingPing}
              onClick={fetchPing}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <RefreshCw size={14} /> Ping
            </ClayButton>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1rem' }}>
            This endpoint (<code>GET /api/teacher/dashboard/ping/</code>) requires an active, approved teacher account with full JWT scope.
          </p>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--r-sm)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-inset-sm)',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: 'var(--text)',
            }}
          >
            {pingData ? JSON.stringify(pingData, null, 2) : 'Awaiting ping response...'}
          </div>
        </div>
      </div>
    </div>
  );
}
