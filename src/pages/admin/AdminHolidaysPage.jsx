import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingHoliday, setDeletingHoliday] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHolidays = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/v1/schedule/holidays/');
      const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setHolidays(list);
    } catch {
      toast.error('Failed to load institutional holidays.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const handleOpenCreate = () => {
    setEditingHoliday(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Holiday title is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingHoliday) {
        await adminApi.patch(`/v1/schedule/holidays/${editingHoliday.id}/`, formData);
        toast.success(`Holiday "${formData.title}" updated.`);
      } else {
        await adminApi.post('/v1/schedule/holidays/', formData);
        toast.success(`Holiday "${formData.title}" added to academic calendar.`);
      }
      setDrawerOpen(false);
      fetchHolidays();
    } catch (err) {
      toast.error(err.response?.data?.date?.[0] || 'Failed to save holiday.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingHoliday) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/v1/schedule/holidays/${deletingHoliday.id}/`);
      toast.success(`Holiday "${deletingHoliday.title}" deleted.`);
      setDeleteConfirmOpen(false);
      fetchHolidays();
    } catch {
      toast.error('Failed to delete holiday.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Holiday Date',
      key: 'date',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--r-xs)',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              fontWeight: '700',
              fontSize: '0.82rem',
            }}
          >
            {row.date}
          </div>
        </div>
      ),
    },
    {
      header: 'Title / Occasion',
      key: 'title',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.title}</span>
          {row.description && (
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button
          type="button"
          onClick={() => {
            setDeletingHoliday(row);
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
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Institutional & Public Holidays
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage campus closures, national public holidays, and exam blackout dates.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={holidays}
        loading={loading}
        totalCount={holidays.length}
        currentPage={1}
        pageSize={25}
        totalPages={1}
        emptyMessage="No holidays scheduled."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> New Holiday
          </ClayButton>
        }
      />

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Schedule Institutional Holiday"
        onSubmit={handleSave}
        loading={saving}
        submitText="Save Holiday"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Holiday Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Occasion Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Dashain Festival Break / Spring Bank Holiday"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Description (Optional)</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Campus notification details..."
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          />
        </div>
      </FormDrawer>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Holiday"
        message={`Are you sure you want to delete holiday "${deletingHoliday?.title}"?`}
        confirmText="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
