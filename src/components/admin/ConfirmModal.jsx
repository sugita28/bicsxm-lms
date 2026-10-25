import { AlertTriangle } from 'lucide-react';
import ClayButton from '../auth/ClayButton';

/**
 * Accessible confirmation modal dialog matching clay aesthetics.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.title
 * @param {string} props.message
 * @param {string} [props.confirmText='Confirm']
 * @param {('primary'|'danger')} [props.confirmVariant='primary']
 * @param {boolean} [props.loading=false]
 * @param {Function} props.onConfirm
 * @param {Function} props.onCancel
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(21, 28, 51, 0.45)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--surface, #e5eaf3)',
          borderRadius: 'var(--r-lg, 28px)',
          boxShadow: 'var(--shadow-raised)',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          fontFamily: 'var(--font-display, Figtree, sans-serif)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: confirmVariant === 'danger' ? '#fee2e2' : '#e0f2fe',
              color: confirmVariant === 'danger' ? '#b91c1c' : '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text)' }}>
            {title}
          </h3>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 1.75rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <ClayButton
            variant="secondary"
            fullWidth={false}
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </ClayButton>

          <ClayButton
            variant={confirmVariant}
            fullWidth={false}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </ClayButton>
        </div>
      </div>
    </div>
  );
}
