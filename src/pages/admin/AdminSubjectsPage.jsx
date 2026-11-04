import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    semester: '',
    description: '',
    credit_hours: 3,
    total_hours: 45,
    is_capstone: false,
    is_active: true,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subjRes, semRes] = await Promise.all([
        adminApi.get(`/academics/subjects/${search ? `?search=${encodeURIComponent(search)}` : ''}`),
        adminApi.get('/academics/semesters/'),
      ]);

      const subjList = subjRes.data?.results || (Array.isArray(subjRes.data) ? subjRes.data : []);
      const semList = semRes.data?.results || (Array.isArray(semRes.data) ? semRes.data : []);

      setSubjects(subjList);
      setSemesters(semList);
    } catch {
      toast.error('Failed to load subjects or semesters.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setFormData({
      code: '',
      name: '',
      semester: semesters[0]?.id || '',
      description: '',
      credit_hours: 3,
      total_hours: 45,
      is_capstone: false,
      is_active: true,
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = (subj) => {
    setEditingSubject(subj);
    setFormData({
      code: subj.code || '',
      name: subj.name || '',
      semester: subj.semester || '',
      description: subj.description || '',
      credit_hours: subj.credit_hours ?? 3,
      total_hours: subj.total_hours ?? 45,
      is_capstone: subj.is_capstone ?? false,
      is_active: subj.is_active ?? true,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Subject name is required.');
      return;
    }
    if (!formData.semester) {
      toast.error('Semester selection is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingSubject) {
        await adminApi.patch(`/academics/subjects/${editingSubject.id}/`, formData);
        toast.success(`Subject "${formData.name}" updated.`);
      } else {
        await adminApi.post('/academics/subjects/', formData);
        toast.success(`Subject "${formData.name}" created.`);
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.name?.[0] || err.response?.data?.code?.[0] || 'Failed to save subject.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSubject) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/academics/subjects/${deletingSubject.id}/`);
      toast.success(`Subject "${deletingSubject.name}" deleted.`);
      setDeleteConfirmOpen(false);
      fetchData();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Cannot delete: Students or classes are enrolled in this subject.');
      } else {
        toast.error('Failed to delete subject.');
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Code',
      key: 'code',
      render: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: '700',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-inset-sm)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--r-xs)',
            fontSize: '0.85rem',
            color: 'var(--accent)',
          }}
        >
          {row.code || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Subject Name',
      key: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div>
            <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.name}</span>
            {row.is_capstone && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--r-pill)',
                  background: '#fef3c7',
                  color: '#b45309',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Star size={10} /> Capstone
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Semester',
      key: 'semester_number',
      render: (row) => row.semester_name || `Sem ${row.semester_number}`,
    },
    {
      header: 'Hours',
      key: 'total_hours',
      render: (row) => `${row.total_hours} hrs (${row.credit_hours} cr)`,
    },
    {
      header: 'Enrolled',
      key: 'enrolled_count',
      render: (row) => row.enrolled_count ?? 0,
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
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setDeletingSubject(row);
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
          Academic Subjects & Modules
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage curriculum course subjects, syllabus total teaching hours, and capstone status.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        loading={loading}
        totalCount={subjects.length}
        currentPage={1}
        pageSize={25}
        totalPages={1}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search subjects by name or code..."
        emptyMessage="No subjects found."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> New Subject
          </ClayButton>
        }
      />

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Create Subject'}
        onSubmit={handleSave}
        loading={saving}
        submitText={editingSubject ? 'Update' : 'Create'}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              Subject Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. CS101"
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
                color: 'var(--text)',
                fontFamily: 'monospace',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Data Structures & Algorithms"
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
            Semester *
          </label>
          <select
            required
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-inset-sm)',
              color: 'var(--text)',
            }}
          >
            <option value="">Select Semester...</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                Semester {s.number} — {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text)' }}>
              Total Hours (standard: 45)
            </label>
            <input
              type="number"
              value={formData.total_hours}
              onChange={(e) => setFormData({ ...formData, total_hours: parseInt(e.target.value, 10) || 45 })}
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
              Credit Hours
            </label>
            <input
              type="number"
              value={formData.credit_hours}
              onChange={(e) => setFormData({ ...formData, credit_hours: parseInt(e.target.value, 10) || 3 })}
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
            placeholder="Course overview, syllabus objectives..."
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

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_capstone}
              onChange={(e) => setFormData({ ...formData, is_capstone: e.target.checked })}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Capstone project (30h standard)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Active subject</span>
          </label>
        </div>
      </FormDrawer>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete subject "${deletingSubject?.name}"?`}
        confirmText="Delete"
        danger
        loading={deleting}
      />
    </div>
  );
}
