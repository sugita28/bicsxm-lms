import { useEffect, useState, useCallback } from 'react';

import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';

export default function AdminProgressPage() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/v1/progress/subjects/?page=${page}`);
      const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setProgressList(list);
      setTotalCount(res.data?.count || list.length);
    } catch {
      toast.error('Failed to load subject progress records.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const columns = [
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
      header: 'Hours Completed / Total',
      key: 'hours_completed',
      render: (row) => {
        const completed = row.hours_completed ?? 0;
        const total = row.total_hours ?? 45;
        const pct = Math.min(100, Math.round((completed / (total || 1)) * 100));

        return (
          <div style={{ width: '180px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <span>{completed} hrs</span>
              <span style={{ fontWeight: '600' }}>{pct}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: pct >= 80 ? 'var(--success)' : 'var(--accent)',
                  borderRadius: 'var(--r-pill)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        );
      },
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
            background: row.status === 'COMPLETED' ? 'var(--success-soft)' : '#e0e7ff',
            color: row.status === 'COMPLETED' ? 'var(--success)' : 'var(--accent)',
          }}
        >
          {row.status || 'IN_PROGRESS'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Curriculum Syllabus Progress
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Track total hours completed vs targets across all batches and modules.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={progressList}
        loading={loading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={20}
        totalPages={Math.ceil(totalCount / 20) || 1}
        onPageChange={setPage}
        emptyMessage="No subject progress entries recorded."
      />
    </div>
  );
}
