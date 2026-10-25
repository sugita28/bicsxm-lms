import { Calendar, Mail, Shield, User, X } from 'lucide-react';
import StatusBadge from '../auth/StatusBadge';

/**
 * Slide-over detail drawer for viewing complete user and profile metadata.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Object|null} props.user
 * @param {Function} props.onClose
 */
export default function UserDetailDrawer({ isOpen, user, onClose }) {
  if (!isOpen || !user) return null;

  const profile = user.profile || {};
  const isTeacher = user.role === 'TEACHER';
  const isStudent = user.role === 'STUDENT';

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(21, 28, 51, 0.4)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'var(--surface, #e5eaf3)',
          boxShadow: 'var(--shadow-raised)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.7)',
          padding: '2.5rem 2rem',
          overflowY: 'auto',
          boxSizing: 'border-box',
          fontFamily: 'var(--font-display, Figtree, sans-serif)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', color: 'var(--text)' }}>
              User Details
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ID: <code>{user.id}</code>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-raised-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r-md, 20px)',
            boxShadow: 'var(--shadow-raised)',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--accent, #2f55ff)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-clay-accent)',
              }}
            >
              <User size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>
                  {user.full_name}
                </h3>
                <StatusBadge status={user.status} />
              </div>
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Role: <strong>{user.role}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text)' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)' }} />
              <span>{user.email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text)' }}>
              <Shield size={16} style={{ color: 'var(--text-muted)' }} />
              <span>
                Account Active: <strong>{user.is_active ? 'Yes' : 'No (Deactivated)'}</strong> &bull; Email Verified:{' '}
                <strong>{user.is_email_verified ? 'Yes' : 'No'}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text)' }}>
              <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
              <span>
                Joined: {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        {(isTeacher || isStudent) && (
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--r-md, 20px)',
              boxShadow: 'var(--shadow-raised)',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.6)',
            }}
          >
            <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text)' }}>
              {isTeacher ? 'Instructor Profile' : 'Student Enrollment Profile'}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              {isTeacher && (
                <>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Department: </span>
                    <strong>{profile.department || 'Not specified'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                    <strong>{profile.phone || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Bio: </span>
                    <p style={{ margin: '0.25rem 0 0', lineHeight: '1.5', color: 'var(--text)' }}>
                      {profile.bio || 'No biography written yet.'}
                    </p>
                  </div>
                </>
              )}

              {isStudent && (
                <>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Enrollment ID: </span>
                    <strong>{profile.enrollment_id || 'Not assigned'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
                    <strong>{profile.phone || 'Not provided'}</strong>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
