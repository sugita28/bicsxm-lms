/**
 * Reusable clay badge for account statuses.
 *
 * @param {Object} props
 * @param {string} props.status - ACTIVE, PENDING_APPROVAL, REJECTED, EMAIL_UNVERIFIED, INACTIVE
 */
export default function StatusBadge({ status, style }) {
  const normalized = (status || '').toUpperCase();

  const configs = {
    ACTIVE: {
      label: 'Active',
      bg: '#e6f7ed',
      color: '#15803d',
      border: 'rgba(21, 128, 61, 0.25)',
    },
    PENDING_APPROVAL: {
      label: 'Pending Approval',
      bg: '#fef3c7',
      color: '#b45309',
      border: 'rgba(180, 83, 9, 0.25)',
    },
    REJECTED: {
      label: 'Application Rejected',
      bg: '#fee2e2',
      color: '#b91c1c',
      border: 'rgba(185, 28, 28, 0.25)',
    },
    EMAIL_UNVERIFIED: {
      label: 'Email Unverified',
      bg: '#e0f2fe',
      color: '#0369a1',
      border: 'rgba(3, 105, 161, 0.25)',
    },
    INACTIVE: {
      label: 'Deactivated',
      bg: '#f1f5f9',
      color: '#64748b',
      border: 'rgba(100, 116, 139, 0.25)',
    },
  };

  const current = configs[normalized] || {
    label: status || 'Unknown',
    bg: '#f1f5f9',
    color: '#64748b',
    border: 'rgba(100, 116, 139, 0.25)',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--r-full, 9999px)',
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.02em',
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        boxShadow: 'var(--shadow-raised-sm)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {current.label}
    </span>
  );
}
