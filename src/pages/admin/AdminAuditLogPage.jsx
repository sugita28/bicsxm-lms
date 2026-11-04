import { useEffect, useState, useCallback } from 'react';

import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/audit-logs/?page=${page}`);
      const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setLogs(list);
      setTotalCount(res.data?.count || list.length);
    } catch {
      toast.error('Failed to load system audit trail.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {row.timestamp ? new Date(row.timestamp).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      header: 'Admin Actor',
      key: 'actor_email',
      render: (row) => (
        <span style={{ fontWeight: '600', color: 'var(--text)' }}>
          {row.actor_email || 'System'}
        </span>
      ),
    },
    {
      header: 'Action Taken',
      key: 'action',
      render: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--r-xs)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-inset-sm)',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            fontWeight: '600',
          }}
        >
          {row.action}
        </span>
      ),
    },
    {
      header: 'Target User',
      key: 'target_email',
      render: (row) => row.target_email || '—',
    },
    {
      header: 'Origin IP',
      key: 'ip',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
          {row.ip || '127.0.0.1'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Administrative Audit Trail
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Immutable log of all user state modifications, approval decisions, and security events.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={20}
        totalPages={Math.ceil(totalCount / 20) || 1}
        onPageChange={setPage}
        emptyMessage="No audit log entries recorded."
      />
    </div>
  );
}
