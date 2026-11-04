import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  History,
  Layers,
  RefreshCw,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingTeachers: 0,
    totalStudents: 0,
    totalBatches: 0,
    totalSubjects: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [pingData, setPingData] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, pendingRes, stuRes, batchRes, subjRes, logRes] = await Promise.allSettled([
        adminApi.get('/users/?page_size=1'),
        adminApi.get('/teachers/?status=pending'),
        adminApi.get('/academics/students/?page_size=1'),
        adminApi.get('/academics/batches/?page_size=1'),
        adminApi.get('/academics/subjects/?page_size=1'),
        adminApi.get('/audit-logs/?page_size=5'),
      ]);

      setStats({
        totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.data?.count || 0 : 0,
        pendingTeachers:
          pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value.data)
            ? pendingRes.value.data.length
            : 0,
        totalStudents: stuRes.status === 'fulfilled' ? stuRes.value.data?.count || 0 : 0,
        totalBatches: batchRes.status === 'fulfilled' ? batchRes.value.data?.count || 0 : 0,
        totalSubjects: subjRes.status === 'fulfilled' ? subjRes.value.data?.count || 0 : 0,
      });

      if (logRes.status === 'fulfilled') {
        const results = logRes.value.data?.results || [];
        setRecentLogs(results);
      }
    } catch {
      toast.error('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handlePing = async () => {
    try {
      const res = await adminApi.get('/dashboard/ping/');
      setPingData(res.data);
      toast.success('Admin authorization verified.');
    } catch {
      toast.error('Failed to ping admin endpoint.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metricCard = (icon, label, value, path, alert = false) => (
    <div
      key={label}
      onClick={() => navigate(path)}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg, 28px)',
        boxShadow: 'var(--shadow-raised)',
        padding: '1.5rem',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: 'var(--r-sm)',
          background: alert ? '#fef3c7' : 'var(--accent)',
          color: alert ? '#b45309' : '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: alert ? 'var(--shadow-raised-sm)' : 'var(--shadow-clay-accent)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          {label}
        </span>
        <h3 style={{ fontSize: '1.75rem', margin: '0.2rem 0 0', color: alert && value > 0 ? '#b45309' : 'var(--text)' }}>
          {loading ? '...' : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
            System Administration
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
            Real-time overview of DCIT academic cohorts, curriculum metrics, and instructor approvals.
          </p>
        </div>

        <ClayButton variant="secondary" onClick={fetchDashboardData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </ClayButton>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {metricCard(<GraduationCap size={24} />, 'Enrolled Students', stats.totalStudents, '/admin/dashboard/students')}
        {metricCard(<Layers size={24} />, 'Active Batches', stats.totalBatches, '/admin/dashboard/batches')}
        {metricCard(<BookOpen size={24} />, 'Course Subjects', stats.totalSubjects, '/admin/dashboard/subjects')}
        {metricCard(<Users size={24} />, 'Registered Users', stats.totalUsers, '/admin/dashboard/users')}
        {metricCard(
          <UserCheck size={24} />,
          'Pending Instructors',
          stats.pendingTeachers,
          '/admin/dashboard/users?status=PENDING_APPROVAL',
          undefined,
          stats.pendingTeachers > 0
        )}
      </div>

      {/* Two Column Layout: Quick Actions / Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Recent Audit Activity */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg, 28px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <History size={20} color="var(--accent)" />
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>Recent Audit Activity</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard/audit-logs')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent audit activity recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--surface)',
                    boxShadow: 'var(--shadow-inset-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '600', color: 'var(--text)' }}>{log.action}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      on {log.target_email || 'user'}
                    </span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Authorization & Diagnostics */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-lg, 28px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle size={20} color="var(--success)" />
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>Root Administrator Authorization Ping</h2>
            </div>
            <ClayButton variant="secondary" onClick={handlePing}>
              Ping Scope
            </ClayButton>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 1rem' }}>
            Validate that your admin JWT cookie carries full scope rights across protected endpoints.
          </p>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--r-sm)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-inset-sm)',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: 'var(--text)',
            }}
          >
            {pingData ? JSON.stringify(pingData, null, 2) : 'Click "Ping Scope" to verify authorization.'}
          </div>
        </div>
      </div>
    </div>
  );
}
