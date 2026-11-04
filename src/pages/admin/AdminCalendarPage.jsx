import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminCalendarPage() {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'entries'
  const [terms, setTerms] = useState([]);
  const [entries, setEntries] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Term Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [termForm, setTermForm] = useState({
    batch: '',
    term_number: 1,
    start_date: '',
    end_date: '',
    teaching_weeks: 15,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [termRes, entryRes, batchRes] = await Promise.all([
        adminApi.get('/v1/calendar/terms/'),
        adminApi.get('/v1/calendar/entries/'),
        adminApi.get('/academics/batches/?page_size=100'),
      ]);

      setTerms(termRes.data?.results || (Array.isArray(termRes.data) ? termRes.data : []));
      setEntries(entryRes.data?.results || (Array.isArray(entryRes.data) ? entryRes.data : []));
      setBatches(batchRes.data?.results || (Array.isArray(batchRes.data) ? batchRes.data : []));
    } catch {
      toast.error('Failed to load academic calendar data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveTerm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.post('/v1/calendar/terms/', termForm);
      toast.success('Batch term configured successfully.');
      setDrawerOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save batch term.');
    } finally {
      setSaving(false);
    }
  };

  const termColumns = [
    {
      header: 'Batch Cohort',
      key: 'batch_name',
      render: (row) => row.batch_name || row.batch,
    },
    {
      header: 'Term #',
      key: 'term_number',
      render: (row) => `Term ${row.term_number}`,
    },
    {
      header: 'Start Date',
      key: 'start_date',
    },
    {
      header: 'End Date',
      key: 'end_date',
    },
    {
      header: 'Teaching Weeks',
      key: 'teaching_weeks',
      render: (row) => `${row.teaching_weeks} weeks`,
    },
  ];

  const entryColumns = [
    {
      header: 'Date',
      key: 'date',
    },
    {
      header: 'Title / Event',
      key: 'title',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600' }}>{row.title}</span>
          {row.description && (
            <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'entry_type',
      render: (row) => (
        <span
          style={{
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--r-pill)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-inset-sm)',
            fontSize: '0.78rem',
          }}
        >
          {row.entry_type || 'Event'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Academic Terms & Calendar
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage batch academic terms, semester teaching windows, and calendar milestones.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--r-pill)',
            border: 'none',
            background: activeTab === 'terms' ? 'var(--accent)' : 'var(--surface)',
            color: activeTab === 'terms' ? '#fff' : 'var(--text)',
            boxShadow: activeTab === 'terms' ? 'var(--shadow-clay-accent)' : 'var(--shadow-raised-sm)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Batch Academic Terms ({terms.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('entries')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--r-pill)',
            border: 'none',
            background: activeTab === 'entries' ? 'var(--accent)' : 'var(--surface)',
            color: activeTab === 'entries' ? '#fff' : 'var(--text)',
            boxShadow: activeTab === 'entries' ? 'var(--shadow-clay-accent)' : 'var(--shadow-raised-sm)',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Calendar Entries ({entries.length})
        </button>
      </div>

      {activeTab === 'terms' ? (
        <DataTable
          columns={termColumns}
          data={terms}
          loading={loading}
          totalCount={terms.length}
          currentPage={1}
          pageSize={20}
          totalPages={1}
          emptyMessage="No batch terms configured."
          actions={
            <ClayButton
              variant="primary"
              onClick={() => {
                setTermForm({
                  batch: batches[0]?.id || '',
                  term_number: 1,
                  start_date: '',
                  end_date: '',
                  teaching_weeks: 15,
                });
                setDrawerOpen(true);
              }}
            >
              <Plus size={16} /> New Term
            </ClayButton>
          }
        />
      ) : (
        <DataTable
          columns={entryColumns}
          data={entries}
          loading={loading}
          totalCount={entries.length}
          currentPage={1}
          pageSize={25}
          totalPages={1}
          emptyMessage="No calendar entries recorded."
        />
      )}

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Configure Batch Academic Term"
        onSubmit={handleSaveTerm}
        loading={saving}
        submitText="Save Term"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Batch Cohort *</label>
          <select
            required
            value={termForm.batch}
            onChange={(e) => setTermForm({ ...termForm, batch: e.target.value })}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          >
            <option value="">Select Batch...</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Term Number *</label>
            <input
              type="number"
              min={1}
              max={6}
              required
              value={termForm.term_number}
              onChange={(e) => setTermForm({ ...termForm, term_number: parseInt(e.target.value, 10) || 1 })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Teaching Weeks</label>
            <input
              type="number"
              value={termForm.teaching_weeks}
              onChange={(e) => setTermForm({ ...termForm, teaching_weeks: parseInt(e.target.value, 10) || 15 })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Start Date *</label>
            <input
              type="date"
              required
              value={termForm.start_date}
              onChange={(e) => setTermForm({ ...termForm, start_date: e.target.value })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>End Date *</label>
            <input
              type="date"
              required
              value={termForm.end_date}
              onChange={(e) => setTermForm({ ...termForm, end_date: e.target.value })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>
        </div>
      </FormDrawer>
    </div>
  );
}
