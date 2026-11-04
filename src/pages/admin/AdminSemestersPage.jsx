import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminSemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    number: 1,
    name: '',
    description: '',
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSemester, setDeletingSemester] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSemesters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/academics/semesters/');
      const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setSemesters(list);
    } catch {
      toast.error('Failed to load semesters.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  const handleOpenCreate = () => {
    setEditingSemester(null);
    setFormData({ number: (semesters.length % 3) + 1, name: '', description: '' });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (sem) => {
    setEditingSemester(sem);
    setFormData({
      number: sem.number || 1,
      name: sem.name || '',
      description: sem.description || '',
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Semester name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingSemester) {
        await adminApi.patch(`/academics/semesters/${editingSemester.id}/`, formData);
        toast.success(`Semester "${formData.name}" updated.`);
      } else {
        await adminApi.post('/academics/semesters/', formData);
        toast.success(`Semester "${formData.name}" created.`);
      }
      setDrawerOpen(false);
      fetchSemesters();
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || 'Failed to save semester.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSemester) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/academics/semesters/${deletingSemester.id}/`);
      toast.success(`Semester "${deletingSemester.name}" deleted.`);
      setDeleteConfirmOpen(false);
      fetchSemesters();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Cannot delete: Subjects are attached to this semester.');
      } else {
        toast.error('Failed to delete semester.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Semester #',
      key: 'number',
      render: (row) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--r-xs)',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '0.85rem',
          }}
        >
          {row.number}
        </span>
      ),
    },
    {
      header: 'Semester Name',
      key: 'name',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.name}</span>
          {row.description && (
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {row.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Subjects Count',
      key: 'subject_count',
      render: (row) => row.subject_count ?? 0,
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
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingSemester(row);
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
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Academic Semesters
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage curriculum stages (Semester 1, 2, 3) and subject groupings.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={semesters}
        loading={loading}
        totalCount={semesters.length}
        currentPage={1}
        pageSize={10}
        totalPages={1}
        emptyMessage="No semesters configured."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> New Semester
          </ClayButton>
        }
      />

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingSemester ? 'Edit Semester' : 'Create Semester'}
        onSubmit={handleSave}
        loading={saving}
        submitText={editingSemester ? 'Update' : 'Create'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
            Semester Number (1-3) *
          </label>
          <input
            type="number"
            min={1}
            max={3}
            required
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value, 10) || 1 })}
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
            Semester Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Semester 1 (Foundation)"
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
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Curriculum summary or module details..."
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
      </FormDrawer>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Semester"
        message={`Are you sure you want to delete semester "${deletingSemester?.name}"?`}
        confirmText="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
