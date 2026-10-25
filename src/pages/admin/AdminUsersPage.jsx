import { Check, ChevronLeft, ChevronRight, Eye, RefreshCw, Search, UserCheck, UserX, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import ConfirmModal from '../../components/admin/ConfirmModal';
import UserDetailDrawer from '../../components/admin/UserDetailDrawer';
import ClayButton from '../../components/auth/ClayButton';
import StatusBadge from '../../components/auth/StatusBadge';

export default function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from searchParams if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [activeFilter, setActiveFilter] = useState(searchParams.get('is_active') || '');
  const [page, setPage] = useState(1);

  // Table data state
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [numPages, setNumPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals & Drawer state
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'activate'|'deactivate'|'approve'|'reject', user }
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (activeFilter) params.set('is_active', activeFilter);

      const res = await adminApi.get(`/users/?${params.toString()}`);
      setUsers(res.data.results || []);
      setTotalCount(res.data.count || 0);
      setNumPages(res.data.num_pages || 1);
    } catch {
      toast.error('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter, activeFilter]);

  useEffect(() => {
    fetchUsers(false);
  }, [fetchUsers]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleViewDetail = async (user) => {
    try {
      const res = await adminApi.get(`/users/${user.id}/`);
      setSelectedUser(res.data);
      setDrawerOpen(true);
    } catch {
      toast.error('Failed to load user details.');
    }
  };

  const handleResendVerification = async (user) => {
    try {
      await adminApi.post(`/users/${user.id}/resend-verification/`);
      toast.success(`Verification email sent to ${user.email}.`);
    } catch (err) {
      toast.error(err.message || 'Could not resend verification email.');
    }
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, user } = confirmAction;
    setActionLoading(true);

    try {
      if (type === 'activate') {
        await adminApi.post(`/users/${user.id}/activate/`);
        toast.success(`Account for ${user.email} activated.`);
      } else if (type === 'deactivate') {
        await adminApi.post(`/users/${user.id}/deactivate/`);
        toast.success(`Account for ${user.email} deactivated.`);
      } else if (type === 'approve') {
        await adminApi.post(`/teachers/${user.id}/approve/`);
        toast.success(`Teacher application for ${user.full_name} approved!`);
      } else if (type === 'reject') {
        await adminApi.post(`/teachers/${user.id}/reject/`);
        toast.success(`Teacher application for ${user.full_name} rejected.`);
      }

      setConfirmAction(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--text)', margin: '0 0 0.35rem', fontFamily: 'var(--font-display)' }}>
            User Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Inspect accounts, review instructor verification, and manage role access ({totalCount} total)
          </p>
        </div>

        <ClayButton
          variant="secondary"
          fullWidth={false}
          onClick={() => {
            setSearch('');
            setRoleFilter('');
            setStatusFilter('');
            setActiveFilter('');
            setSearchParams({});
            setPage(1);
          }}
          style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
        >
          <RefreshCw size={14} /> Reset Filters
        </ClayButton>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-md, 20px)',
          boxShadow: 'var(--shadow-raised)',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 280px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                fontSize: '0.9rem',
                color: 'var(--text)',
                background: 'var(--surface)',
                borderRadius: 'var(--r-full)',
                border: 'none',
                boxShadow: 'var(--shadow-inset-sm)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
          </div>
          <ClayButton type="submit" fullWidth={false} style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem' }}>
            Search
          </ClayButton>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-full)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              border: 'none',
              fontSize: '0.875rem',
              color: 'var(--text)',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-full)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              border: 'none',
              fontSize: '0.875rem',
              color: 'var(--text)',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="REJECTED">Rejected</option>
            <option value="EMAIL_UNVERIFIED">Email Unverified</option>
          </select>

          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--r-full)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              border: 'none',
              fontSize: '0.875rem',
              color: 'var(--text)',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All Activity</option>
            <option value="true">Active Only</option>
            <option value="false">Deactivated Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r-lg, 28px)',
          boxShadow: 'var(--shadow-raised)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.6)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--divider)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700' }}>User</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: '700' }}>Role</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: '700' }}>Status</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: '700' }}>Active</th>
              <th style={{ padding: '1.25rem 1rem', fontWeight: '700' }}>Joined</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No users found matching the selected criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isPendingTeacher = u.role === 'TEACHER' && u.approval_status === 'PENDING';
                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid rgba(86, 96, 140, 0.1)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text)' }}>{u.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1rem', fontWeight: '600', color: 'var(--text)' }}>
                      {u.role}
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          fontWeight: '700',
                          color: u.is_active ? 'var(--success, #1f8a5b)' : 'var(--danger, #b3342a)',
                        }}
                      >
                        {u.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        {/* View Drawer */}
                        <button
                          type="button"
                          onClick={() => handleViewDetail(u)}
                          title="View user details"
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: 'var(--r-sm)',
                            border: 'none',
                            background: 'var(--surface)',
                            boxShadow: 'var(--shadow-raised-sm)',
                            cursor: 'pointer',
                            color: 'var(--accent, #2f55ff)',
                          }}
                        >
                          <Eye size={16} />
                        </button>

                        {/* Teacher Approval Actions */}
                        {isPendingTeacher && (
                          <>
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: 'approve', user: u })}
                              title="Approve teacher application"
                              style={{
                                padding: '0.4rem 0.65rem',
                                borderRadius: 'var(--r-sm)',
                                border: 'none',
                                background: '#e6f7ed',
                                color: '#15803d',
                                cursor: 'pointer',
                              }}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmAction({ type: 'reject', user: u })}
                              title="Reject teacher application"
                              style={{
                                padding: '0.4rem 0.65rem',
                                borderRadius: 'var(--r-sm)',
                                border: 'none',
                                background: '#fee2e2',
                                color: '#b91c1c',
                                cursor: 'pointer',
                              }}
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                        {/* Resend Verification */}
                        {!u.is_email_verified && (
                          <button
                            type="button"
                            onClick={() => handleResendVerification(u)}
                            title="Resend verification OTP email"
                            style={{
                              padding: '0.4rem 0.65rem',
                              borderRadius: 'var(--r-sm)',
                              border: 'none',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                            }}
                          >
                            Resend OTP
                          </button>
                        )}

                        {/* Activate / Deactivate Toggle */}
                        {u.is_active ? (
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'deactivate', user: u })}
                            title="Deactivate account"
                            style={{
                              padding: '0.4rem 0.65rem',
                              borderRadius: 'var(--r-sm)',
                              border: 'none',
                              background: 'var(--surface)',
                              boxShadow: 'var(--shadow-raised-sm)',
                              cursor: 'pointer',
                              color: 'var(--danger, #b3342a)',
                            }}
                          >
                            <UserX size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'activate', user: u })}
                            title="Activate account"
                            style={{
                              padding: '0.4rem 0.65rem',
                              borderRadius: 'var(--r-sm)',
                              border: 'none',
                              background: 'var(--surface)',
                              boxShadow: 'var(--shadow-raised-sm)',
                              cursor: 'pointer',
                              color: 'var(--success, #1f8a5b)',
                            }}
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination bar */}
        {numPages > 1 && (
          <div
            style={{
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--divider)',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Page {page} of {numPages}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ClayButton
                variant="secondary"
                fullWidth={false}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} /> Prev
              </ClayButton>

              <ClayButton
                variant="secondary"
                fullWidth={false}
                disabled={page >= numPages}
                onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                Next <ChevronRight size={16} />
              </ClayButton>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Slide-over Drawer */}
      <UserDetailDrawer
        isOpen={drawerOpen}
        user={selectedUser}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(confirmAction)}
        title={
          confirmAction?.type === 'activate'
            ? 'Activate Account'
            : confirmAction?.type === 'deactivate'
            ? 'Deactivate Account'
            : confirmAction?.type === 'approve'
            ? 'Approve Instructor'
            : 'Reject Instructor'
        }
        message={
          confirmAction?.type === 'deactivate'
            ? `Are you sure you want to deactivate ${confirmAction?.user?.email}? All of their active sessions and JWT tokens will be immediately revoked.`
            : confirmAction?.type === 'activate'
            ? `Activate the account for ${confirmAction?.user?.email}?`
            : confirmAction?.type === 'approve'
            ? `Approve ${confirmAction?.user?.full_name} as an active course instructor?`
            : `Reject instructor application for ${confirmAction?.user?.full_name}?`
        }
        confirmText={
          confirmAction?.type === 'deactivate'
            ? 'Deactivate User'
            : confirmAction?.type === 'activate'
            ? 'Activate User'
            : confirmAction?.type === 'approve'
            ? 'Approve Application'
            : 'Reject Application'
        }
        confirmVariant={confirmAction?.type === 'deactivate' || confirmAction?.type === 'reject' ? 'danger' : 'primary'}
        loading={actionLoading}
        onConfirm={executeConfirmedAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
