import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import DataTable from '../../components/admin/DataTable';
import FormDrawer from '../../components/admin/FormDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import ClayButton from '../../components/auth/ClayButton';

const PROGRAMMES = [
  { value: 'FOUNDATION_IT', label: 'Foundation in IT' },
  { value: 'DIPLOMA_COMPUTING', label: 'Diploma in Computing' },
  { value: 'DIPLOMA_ANIMATION', label: 'Diploma in Animation' },
  { value: 'DUAL_CERT_DCIT', label: 'Dual Certification DCIT' },
];


export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('');

  // Form Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: 'MALE',
    date_of_birth: '2005-01-01',
    address: '',
    father_name: '',
    mother_name: '',
    guardian_contact: '',
    mobile: '',
    email: '',
    national_id: '',
    programme: 'DIPLOMA_COMPUTING',
    batch: '',
    admission_status: 'ENROLLED',
    sqa_status: 'PENDING',
  });

  // Account creation dialog
  const [accountDialogStudent, setAccountDialogStudent] = useState(null);
  const [accountPassword, setAccountPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);

  // Delete Dialog
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      if (search) params.set('q', search);
      if (batchFilter) params.set('batch', batchFilter);
      if (programmeFilter) params.set('programme', programmeFilter);

      const [stuRes, batchRes] = await Promise.all([
        adminApi.get(`/academics/students/?${params.toString()}`),
        adminApi.get('/academics/batches/?page_size=100'),
      ]);

      const stuList = stuRes.data?.results || (Array.isArray(stuRes.data) ? stuRes.data : []);
      setStudents(stuList);
      setTotalCount(stuRes.data?.count || stuList.length);

      const batchList = batchRes.data?.results || (Array.isArray(batchRes.data) ? batchRes.data : []);
      setBatches(batchList);
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, [page, search, batchFilter, programmeFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      first_name: '',
      middle_name: '',
      last_name: '',
      gender: 'MALE',
      date_of_birth: '2005-01-01',
      address: '',
      father_name: '',
      mother_name: '',
      guardian_contact: '',
      mobile: '',
      email: '',
      national_id: '',
      programme: 'DIPLOMA_COMPUTING',
      batch: batches[0]?.id || '',
      admission_status: 'ENROLLED',
      sqa_status: 'PENDING',
    });
    setDrawerOpen(true);
  };

  const handleOpenEdit = async (stu) => {
    setEditingStudent(stu);
    try {
      const detail = await adminApi.get(`/academics/students/${stu.id}/`);
      const s = detail.data;
      setFormData({
        first_name: s.first_name || '',
        middle_name: s.middle_name || '',
        last_name: s.last_name || '',
        gender: s.gender || 'MALE',
        date_of_birth: s.date_of_birth || '2005-01-01',
        address: s.address || '',
        father_name: s.father_name || '',
        mother_name: s.mother_name || '',
        guardian_contact: s.guardian_contact || '',
        mobile: s.mobile || '',
        email: s.email || '',
        national_id: s.national_id || '',
        programme: s.programme || 'DIPLOMA_COMPUTING',
        batch: s.batch || '',
        admission_status: s.admission_status || 'ENROLLED',
        sqa_status: s.sqa_status || 'PENDING',
      });
      setDrawerOpen(true);
    } catch {
      toast.error('Failed to load student details.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStudent) {
        await adminApi.patch(`/academics/students/${editingStudent.id}/`, formData);
        toast.success(`Student "${formData.first_name} ${formData.last_name}" updated.`);
      } else {
        await adminApi.post('/academics/students/', formData);
        toast.success(`Student "${formData.first_name} ${formData.last_name}" enrolled.`);
      }
      setDrawerOpen(false);
      fetchStudents();
    } catch (err) {
      const data = err.response?.data;
      const errorMsg =
        typeof data === 'object'
          ? Object.entries(data)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
              .join(' | ')
          : 'Failed to save student.';
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!accountDialogStudent || !accountPassword) return;
    setCreatingAccount(true);
    try {
      await adminApi.post(`/academics/students/${accountDialogStudent.id}/create-account/`, {
        password: accountPassword,
      });
      toast.success(`Portal account created for ${accountDialogStudent.full_name}!`);
      setAccountDialogStudent(null);
      setAccountPassword('');
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.password?.[0] || 'Failed to create student account.');
    } finally {
      setCreatingAccount(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/academics/students/${deletingStudent.id}/`);
      toast.success(`Student "${deletingStudent.full_name}" deleted.`);
      setDeleteConfirmOpen(false);
      fetchStudents();
    } catch {
      toast.error('Failed to delete student.');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Student Number',
      key: 'student_number',
      render: (row) => (
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: '700',
            color: 'var(--accent)',
            fontSize: '0.85rem',
          }}
        >
          {row.student_number || 'STU-PENDING'}
        </span>
      ),
    },
    {
      header: 'Student Name',
      key: 'full_name',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text)' }}>{row.full_name}</span>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {row.email || 'No email'} · {row.mobile || 'No mobile'}
          </p>
        </div>
      ),
    },
    {
      header: 'Programme',
      key: 'programme_display',
      render: (row) => row.programme_display || row.programme,
    },
    {
      header: 'Batch',
      key: 'batch_name',
      render: (row) => row.batch_name || '—',
    },
    {
      header: 'Admission',
      key: 'admission_status',
      render: (row) => (
        <span
          style={{
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--r-pill)',
            fontSize: '0.75rem',
            fontWeight: '600',
            background: row.admission_status === 'ENROLLED' ? 'var(--success-soft)' : '#e0e7ff',
            color: row.admission_status === 'ENROLLED' ? 'var(--success)' : 'var(--accent)',
          }}
        >
          {row.admission_status_display || row.admission_status}
        </span>
      ),
    },
    {
      header: 'Portal Access',
      key: 'has_account',
      render: (row) =>
        row.has_account ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--success)',
              fontSize: '0.8rem',
              fontWeight: '600',
            }}
          >
            <CheckCircle2 size={14} /> Active
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setAccountDialogStudent(row)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--r-pill)',
              padding: '0.2rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Key size={12} /> Create Login
          </button>
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
              setDeletingStudent(row);
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
          Student Cohort Directory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
          Manage student admissions, batch allocation, SQA registration numbers, and portal credentials.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select
          value={batchFilter}
          onChange={(e) => {
            setBatchFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--divider)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-inset-sm)',
            color: 'var(--text)',
            fontSize: '0.9rem',
          }}
        >
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={programmeFilter}
          onChange={(e) => {
            setProgrammeFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--divider)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-inset-sm)',
            color: 'var(--text)',
            fontSize: '0.9rem',
          }}
        >
          <option value="">All Programmes</option>
          {PROGRAMMES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        totalCount={totalCount}
        currentPage={page}
        pageSize={15}
        totalPages={Math.ceil(totalCount / 15) || 1}
        onPageChange={setPage}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search student name, ID, phone..."
        emptyMessage="No students match the selected criteria."
        actions={
          <ClayButton variant="primary" onClick={handleOpenCreate}>
            <Plus size={16} /> Enrol Student
          </ClayButton>
        }
      />

      {/* Drawer */}
      <FormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingStudent ? 'Edit Student Record' : 'Enrol New Student'}
        onSubmit={handleSave}
        loading={saving}
        submitText={editingStudent ? 'Update Record' : 'Complete Admission'}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>First Name *</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Middle Name</label>
            <input
              type="text"
              value={formData.middle_name}
              onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Last Name *</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Mobile Phone *</label>
            <input
              type="text"
              required
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+977-9800000000"
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Programme *</label>
            <select
              value={formData.programme}
              onChange={(e) => setFormData({ ...formData, programme: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            >
              {PROGRAMMES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Batch Cohort *</label>
            <select
              required
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Father's Name *</label>
            <input
              type="text"
              required
              value={formData.father_name}
              onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Guardian Contact *</label>
            <input
              type="text"
              required
              value={formData.guardian_contact}
              onChange={(e) => setFormData({ ...formData, guardian_contact: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--r-xs)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Residential Address *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--r-xs)',
              border: '1px solid var(--divider)',
              background: 'var(--surface)',
            }}
          />
        </div>
      </FormDrawer>

      {/* Account Creation Modal */}
      <ConfirmDialog
        isOpen={Boolean(accountDialogStudent)}
        onClose={() => setAccountDialogStudent(null)}
        onConfirm={handleCreateAccount}
        title="Create Student Portal Account"
        message={
          <div>
            <p>
              Generate student login for <strong>{accountDialogStudent?.full_name}</strong> (
              {accountDialogStudent?.email}).
            </p>
            <input
              type="password"
              placeholder="Enter initial password (min 8 chars)..."
              value={accountPassword}
              onChange={(e) => setAccountPassword(e.target.value)}
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--divider)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-inset-sm)',
              }}
            />
          </div>
        }
        confirmText="Generate Login"
        loading={creatingAccount}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={`Are you sure you want to delete student "${deletingStudent?.full_name}"?`}
        confirmText="Delete Student"
        danger
        loading={deleting}
      />
    </div>
  );
}
