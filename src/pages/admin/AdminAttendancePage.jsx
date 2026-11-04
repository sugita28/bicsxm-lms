import { useEffect, useState, useCallback } from 'react';
import { Lock, Unlock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';

export default function AdminAttendancePage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/v1/attendance/sessions/?page=${page}`);
      const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setSessions(list);
      setTotalCount(res.data?.count || list.length);
    } catch {
      toast.error('Failed to load attendance sessions.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const columns = [
    {
      header: 'Date',
      key: 'date',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="var(--accent)" />
          <span style={{ fontWeight: '600' }}>{row.date}</span>
        </div>
      ),
    },
    {
      header: 'Subject & Batch',
      key: 'subject_name',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>
            {row.subject_name || row.subject}
          </span>
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Batch: {row.batch_name || row.batch}
          </p>
        </div>
      ),
    },
    {
      header: 'Teacher',
      key: 'teacher_name',
      render: (row) => row.teacher_name || 'Assigned Instructor',
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--r-pill)',
            fontSize: '0.75rem',
            fontWeight: '600',
            background: row.status === 'LOCKED' ? 'var(--surface)' : 'var(--success-soft)',
            boxShadow: row.status === 'LOCKED' ? 'var(--shadow-inset-sm)' : 'none',
            color: row.status === 'LOCKED' ? 'var(--text-muted)' : 'var(--success)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          {row.status === 'LOCKED' ? <Lock size={12} /> : <Unlock size={12} />}
          {row.status || 'OPEN'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Attendance Operations & Audit
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Monitor classroom lecture sessions, check-in logs, and faculty verification statuses.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        loading={loading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={20}
        totalPages={Math.ceil(totalCount / 20) || 1}
        onPageChange={setPage}
        emptyMessage="No attendance sessions recorded."
      />
    </div>
  );
}
