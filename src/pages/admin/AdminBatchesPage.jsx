import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

const INTAKE_MONTHS = [
  { value: 'JAN_FEB', label: 'January / February' },
  { value: 'JUNE_JULY', label: 'June / July' },
  { value: 'OTHER', label: 'Other' },
];

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    intake_year: new Date().getFullYear(),
    intake_month: 'JAN_FEB',
    start_date: '',
    end_date: '',
    description: '',
    is_active: true,
  });

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBatches = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      if (search) params.set('search', search);

      const res = await adminApi.get(`/academics/batches/?${params.toString()}`);
      if (res.data?.results) {
        setBatches(res.data.results);
        setTotalCount(res.data.count || 0);
      } else if (Array.isArray(res.data)) {
        setBatches(res.data);
        setTotalCount(res.data.length);
      }
    } catch {
      toast.error('Failed to load academic batches.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setFormData({
      name: '',
      intake_year: new Date().getFullYear(),
      intake_month: 'JAN_FEB',
      start_date: '',
      end_date: '',
      description: '',
      is_active: true,
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name || '',
      intake_year: batch.intake_year || new Date().getFullYear(),
      intake_month: batch.intake_month || 'JAN_FEB',
      start_date: batch.start_date || '',
      end_date: batch.end_date || '',
      description: batch.description || '',
      is_active: batch.is_active ?? true,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Batch name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingBatch) {
        await adminApi.patch(`/academics/batches/${editingBatch.id}/`, formData);
        toast.success(`Batch "${formData.name}" updated successfully.`);
      } else {
        await adminApi.post('/academics/batches/', formData);
        toast.success(`Batch "${formData.name}" created successfully.`);
      }
      setDrawerOpen(false);
      fetchBatches();
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || err.response?.data?.detail || 'Failed to save batch.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBatch) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/academics/batches/${deletingBatch.id}/`);
      toast.success(`Batch "${deletingBatch.name}" deleted.`);
      setDeleteConfirmOpen(false);
      fetchBatches();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Cannot delete: Students or classes still depend on this batch.');
      } else {
        toast.error('Failed to delete batch.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Batch Name',
      key: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--r-xs)',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={16} />
          </div>
          <div>
            <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.name}</span>
            {row.description && (
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {row.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Intake Year',
      key: 'intake_year',
      render: (row) => `${row.intake_year} (${row.intake_month_display || row.intake_month})`,
    },
    {
      header: 'Enrolled Students',
      key: 'student_count',
      render: (row) => row.student_count ?? 0,
    },
    {
      header: 'Start Date',
      key: 'start_date',
      render: (row) => row.start_date || '—',
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (row) => (
        <span
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--r-pill)',
            fontSize: '0.75rem',
            fontWeight: '600',
            background: row.is_active ? 'var(--success-soft)' : '#fee2e2',
            color: row.is_active ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--r-xs)',
              border: 'none',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              color: 'var(--accent)',
              cursor: 'pointer',
            }}
            title="Edit batch"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingBatch(row);
              setDeleteConfirmOpen(true);
            }}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--r-xs)',
              border: 'none',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              color: 'var(--danger)',
              cursor: 'pointer',
            }}
            title="Delete batch"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Academic Batches
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage student cohorts, intake periods, and track batch progression.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        loading={loading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={15}
        totalPages={Math.ceil(totalCount / 15) || 1}
        onPageChange={setPage}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search batches by name..."
        emptyMessage="No academic batches found."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> New Batch
          </ClayButton>
        }
      />

      {/* Drawer */}
      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingBatch ? 'Edit Batch' : 'Create New Batch'}
        subtitle="Cohorts organise students for timetable slots and syllabus progress."
        onSubmit={handleSave}
        loading={saving}
        submitText={editingBatch ? 'Update Batch' : 'Create Batch'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
            Batch Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Batch 2026 Spring"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-inset-sm)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              Intake Year *
            </label>
            <input
              type="number"
              required
              value={formData.intake_year}
              onChange={(e) => setFormData({ ...formData, intake_year: parseInt(e.target.value, 10) || 2026 })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
                color: 'var(--text)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              Intake Month
            </label>
            <select
              value={formData.intake_month}
              onChange={(e) => setFormData({ ...formData, intake_month: e.target.value })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
                color: 'var(--text)',
              }}
            >
              {INTAKE_MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
                color: 'var(--text)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Cohort notes or intake details..."
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-inset-sm)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            type="checkbox"
            id="batch_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <label htmlFor="batch_active" style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
            Active cohort
          </label>
        </div>
      </FormDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Academic Batch"
        message={`Are you sure you want to delete batch "${deletingBatch?.name}"? If students are enrolled in this batch, deletion will be safely rejected.`}
        confirmText="Delete Batch"
        danger
        loading={deleting}
      />
    </div>
  );
}
