import { CheckCircle, RefreshCw, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pingData, setPingData] = useState(null);
  const [loadingPing, setLoadingPing] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, pendingTeachers: 0 });

  const fetchPing = async () => {
    try {
      const res = await adminApi.get('/dashboard/ping/');
      setPingData(res.data);
    } catch {
      toast.error('Failed to ping admin dashboard endpoint.');
    } finally {
      setLoadingPing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersRes, pendingRes] = await Promise.all([
        adminApi.get('/users/?page_size=1'),
        adminApi.get('/teachers/?status=pending'),
      ]);
      setStats({
        totalUsers: usersRes.data.count || 0,
        pendingTeachers: Array.isArray(pendingRes.data) ? pendingRes.data.length : 0,
      });
    } catch {
      // Quiet background metrics catch
    }
  };

  useEffect(() => {
    fetchPing();
    fetchStats();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          System Administration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage user accounts, review instructor applications, and audit platform activity.
        </p>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          onClick={() => navigate('/admin/dashboard/users')}
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg, 28px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '1.75rem',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            transition: 'transform 0.15s ease',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--accent, #2f55ff)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-clay-accent)',
            }}
          >
            <Users size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Total Users Registered
            </span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.2rem 0 0', color: 'var(--text)' }}>
              {stats.totalUsers}
            </h3>
          </div>
        </div>

        <div
          onClick={() => navigate('/admin/dashboard/users?status=PENDING_APPROVAL')}
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg, 28px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '1.75rem',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            transition: 'transform 0.15s ease',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--r-sm)',
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-raised-sm)',
            }}
          >
            <UserCheck size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Pending Teacher Approvals
            </span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.2rem 0 0', color: stats.pendingTeachers > 0 ? '#b45309' : 'var(--text)' }}>
              {stats.pendingTeachers}
            </h3>
          </div>
        </div>
      </div>

      {/* Ping Authorization Card */}
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
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>
              Root Administrator Authorization Ping
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
          Validates that the administrator session has full scope access to role-protected endpoints (<code>GET /api/admin/dashboard/ping/</code>).
        </p>

        <div
          style={{
            padding: '1.25rem',
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
  );
}
