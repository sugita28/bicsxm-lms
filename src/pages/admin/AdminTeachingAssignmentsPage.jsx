import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminTeachingAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    teacher: '',
    subject: '',
    batch: '',
    is_active: true,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingAssignment, setDeletingAssignment] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assignRes, teachRes, subjRes, batchRes] = await Promise.all([
        adminApi.get('/academics/teaching-assignments/'),
        adminApi.get('/teachers/?status=approved'),
        adminApi.get('/academics/subjects/?page_size=100'),
        adminApi.get('/academics/batches/?page_size=100'),
      ]);

      setAssignments(assignRes.data?.results || (Array.isArray(assignRes.data) ? assignRes.data : []));
      setTeachers(teachRes.data?.results || (Array.isArray(teachRes.data) ? teachRes.data : []));
      setSubjects(subjRes.data?.results || (Array.isArray(subjRes.data) ? subjRes.data : []));
      setBatches(batchRes.data?.results || (Array.isArray(batchRes.data) ? batchRes.data : []));
    } catch {
      toast.error('Failed to load teaching assignments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingAssignment(null);
    setFormData({
      teacher: teachers[0]?.id || '',
      subject: subjects[0]?.id || '',
      batch: batches[0]?.id || '',
      is_active: true,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAssignment) {
        await adminApi.patch(`/academics/teaching-assignments/${editingAssignment.id}/`, formData);
        toast.success('Assignment updated successfully.');
      } else {
        await adminApi.post('/academics/teaching-assignments/', formData);
        toast.success('Teacher assigned successfully.');
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Failed to save assignment.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingAssignment) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/academics/teaching-assignments/${deletingAssignment.id}/`);
      toast.success('Teaching assignment removed.');
      setDeleteConfirmOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to remove assignment.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Teacher',
      key: 'teacher_name',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.teacher_name}</span>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {row.teacher_email}
          </p>
        </div>
      ),
    },
    {
      header: 'Subject Module',
      key: 'subject_name',
      render: (row) => `${row.subject_name} (${row.subject_code || 'N/A'})`,
    },
    {
      header: 'Batch Cohort',
      key: 'batch_name',
    },
    {
      header: 'Status',
      key: 'is_active',
      render: (row) => (
        <span
          style={{
            padding: '0.2rem 0.5rem',
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
        <button
          type="button"
          onClick={() => {
            setDeletingAssignment(row);
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
          Teacher Subject Assignments
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Allocate approved instructors to specific cohort subjects for attendance and grading.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={assignments}
        loading={loading}
        totalCount={assignments.length}
        currentPage={1}
        pageSize={20}
        totalPages={1}
        emptyMessage="No teaching assignments allocated."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Assign Teacher
          </ClayButton>
        }
      />

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Assign Teacher to Subject"
        onSubmit={handleSave}
        loading={saving}
        submitText="Save Assignment"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Teacher *</label>
          <select
            required
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          >
            <option value="">Select Instructor...</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.full_name} ({t.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Subject Module *</label>
          <select
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          >
            <option value="">Select Subject...</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code || 'N/A'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Batch Cohort *</label>
          <select
            required
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
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
      </FormDrawer>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove Teaching Assignment"
        message={`Are you sure you want to remove ${deletingAssignment?.teacher_name} from ${deletingAssignment?.subject_name}?`}
        confirmText="Remove"
        danger
        loading={deleting}
      />
    </div>
  );
}
