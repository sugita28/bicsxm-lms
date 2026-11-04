import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ClayButton from '../../components/auth/ClayButton';

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    short_code: '',
    programme_type: 'diploma',
    tagline: '',
    duration_label: '1 Year',
    total_months: 12,
    is_active: true,
    is_featured: false,
  });

  const fetchProgrammes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/academics/programmes/');
      const list = res.data?.results || (Array.isArray(res.data) ? res.data : []);
      setProgrammes(list);
    } catch {
      toast.error('Failed to load academic programmes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgrammes();
  }, [fetchProgrammes]);

  const handleOpenEdit = (prog) => {
    setEditingProg(prog);
    setFormData({
      name: prog.name || '',
      slug: prog.slug || '',
      short_code: prog.short_code || '',
      programme_type: prog.programme_type || 'diploma',
      tagline: prog.tagline || '',
      duration_label: prog.duration_label || '1 Year',
      total_months: prog.total_months || 12,
      is_active: prog.is_active ?? true,
      is_featured: prog.is_featured ?? false,
    });
    setDrawerOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProg) {
        await adminApi.patch(`/academics/programmes/${editingProg.slug}/`, formData);
        toast.success(`Programme "${formData.name}" updated.`);
      } else {
        await adminApi.post('/academics/programmes/', formData);
        toast.success(`Programme "${formData.name}" created.`);
      }
      setDrawerOpen(false);
      fetchProgrammes();
    } catch (err) {
      toast.error(err.response?.data?.name?.[0] || 'Failed to save programme.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      header: 'Code',
      key: 'short_code',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--accent)' }}>
          {row.short_code || row.slug}
        </span>
      ),
    },
    {
      header: 'Programme Name',
      key: 'name',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.name}</span>
          {row.tagline && (
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {row.tagline}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Type',
      key: 'programme_type',
      render: (row) => (
        <span
          style={{
            textTransform: 'capitalize',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--r-pill)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-inset-sm)',
            fontSize: '0.78rem',
          }}
        >
          {row.programme_type?.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Duration',
      key: 'duration_label',
      render: (row) => `${row.duration_label} (${row.total_months} mos)`,
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
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
          Degree & Diploma Programmes
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage certifications, dual affiliations, Scottish SCQF credits, and marketing metadata.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={programmes}
        loading={loading}
        totalCount={programmes.length}
        currentPage={1}
        pageSize={20}
        totalPages={1}
        emptyMessage="No academic programmes configured."
        actions={
          <ClayButton
            variant="primary"
            onClick={() => {
              setEditingProg(null);
              setFormData({
                name: '',
                slug: '',
                short_code: '',
                programme_type: 'diploma',
                tagline: '',
                duration_label: '1 Year',
                total_months: 12,
                is_active: true,
                is_featured: false,
              });
              setDrawerOpen(true);
            }}
          >
            <Plus size={16} /> New Programme
          </ClayButton>
        }
      />

      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingProg ? 'Edit Programme' : 'Create Programme'}
        onSubmit={handleSave}
        loading={saving}
        submitText={editingProg ? 'Update' : 'Create'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Programme Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Short Code *</label>
            <input
              type="text"
              required
              value={formData.short_code}
              onChange={(e) => setFormData({ ...formData, short_code: e.target.value.toUpperCase() })}
              placeholder="e.g. DCIT"
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                fontFamily: 'monospace',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>URL Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
              placeholder="e.g. diploma-computing"
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
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Duration Label</label>
            <input
              type="text"
              value={formData.duration_label}
              onChange={(e) => setFormData({ ...formData, duration_label: e.target.value })}
              placeholder="e.g. 1 Year (Full-time)"
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Total Duration (Months)</label>
            <input
              type="number"
              value={formData.total_months}
              onChange={(e) => setFormData({ ...formData, total_months: parseInt(e.target.value, 10) || 12 })}
              style={{
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tagline</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. SQA accredited dual qualification in software development"
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-sm)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          />
        </div>
      </FormDrawer>
    </div>
  );
}
