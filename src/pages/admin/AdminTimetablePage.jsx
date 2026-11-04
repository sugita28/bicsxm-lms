import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

const WEEKDAYS = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
];

export default function AdminTimetablePage() {
  const [slots, setSlots] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    batch: '',
    subject: '',
    teacher: '',
    weekday: 0,
    start_time: '09:00',
    end_time: '11:00',
    is_active: true,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [slotRes, batchRes, subjRes, teachRes] = await Promise.all([
        adminApi.get('/v1/schedule/timetable/'),
        adminApi.get('/academics/batches/?page_size=100'),
        adminApi.get('/academics/subjects/?page_size=100'),
        adminApi.get('/teachers/?status=approved'),
      ]);

      setSlots(slotRes.data?.results || (Array.isArray(slotRes.data) ? slotRes.data : []));
      setBatches(batchRes.data?.results || (Array.isArray(batchRes.data) ? batchRes.data : []));
      setSubjects(subjRes.data?.results || (Array.isArray(subjRes.data) ? subjRes.data : []));
      setTeachers(teachRes.data?.results || (Array.isArray(teachRes.data) ? teachRes.data : []));
    } catch {
      toast.error('Failed to load timetable slots.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditingSlot(null);
    setFormData({
      batch: batches[0]?.id || '',
      subject: subjects[0]?.id || '',
      teacher: teachers[0]?.id || '',
      weekday: 0,
      start_time: '09:00',
      end_time: '11:00',
      is_active: true,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingSlot) {
        await adminApi.patch(`/v1/schedule/timetable/${editingSlot.id}/`, formData);
        toast.success('Timetable slot updated.');
      } else {
        await adminApi.post('/v1/schedule/timetable/', formData);
        toast.success('Timetable slot scheduled.');
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.end_time?.[0] || 'Failed to save timetable slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSlot) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/v1/schedule/timetable/${deletingSlot.id}/`);
      toast.success('Timetable slot deleted.');
      setDeleteConfirmOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to delete timetable slot.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Day & Time',
      key: 'weekday',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} color="var(--accent)" />
          <div>
            <span style={{ fontWeight: '600', color: 'var(--text)' }}>
              {row.weekday_display || WEEKDAYS[row.weekday]?.label}
            </span>
            <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {row.start_time} – {row.end_time}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Subject',
      key: 'subject_name',
      render: (row) => `${row.subject_name} (${row.subject_code || 'N/A'})`,
    },
    {
      header: 'Cohort Batch',
      key: 'batch_name',
    },
    {
      header: 'Instructor',
      key: 'teacher_name',
      render: (row) => row.teacher_name || 'Unassigned',
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
            setDeletingSlot(row);
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
          Weekly Timetable Scheduling
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Configure recurring subject lecture slots, classroom times, and faculty allocations.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={slots}
        loading={loading}
        totalCount={slots.length}
        currentPage={1}
        pageSize={25}
        totalPages={1}
        emptyMessage="No timetable slots scheduled."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> New Slot
          </ClayButton>
        }
      />

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Schedule Timetable Slot"
        onSubmit={handleSave}
        loading={saving}
        submitText="Save Slot"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Batch *</label>
            <select
              required
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-xs)', border: '1px solid var(--divider)', background: 'var(--surface)' }}
            >
              <option value="">Select Batch...</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Subject *</label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-xs)', border: '1px solid var(--divider)', background: 'var(--surface)' }}
            >
              <option value="">Select Subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Teacher (Optional)</label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-xs)', border: '1px solid var(--divider)', background: 'var(--surface)' }}
            >
              <option value="">Unassigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Weekday *</label>
            <select
              value={formData.weekday}
              onChange={(e) => setFormData({ ...formData, weekday: parseInt(e.target.value, 10) })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-xs)', border: '1px solid var(--divider)', background: 'var(--surface)' }}
            >
              {WEEKDAYS.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Start Time *</label>
            <input
              type="time"
              required
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-xs)', border: '1px solid var(--divider)', background: 'var(--surface)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>End Time *</label>
            <input
              type="time"
              required
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-xs)', border: '1px solid var(--divider)', background: 'var(--surface)' }}
            />
          </div>
        </div>
      </FormDrawer>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Timetable Slot"
        message="Are you sure you want to delete this lecture slot?"
        confirmText="Delete Slot"
        danger
        loading={deleting}
      />
    </div>
  );
}
