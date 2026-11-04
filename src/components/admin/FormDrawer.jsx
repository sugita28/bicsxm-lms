
import { X } from 'lucide-react';
import ClayButton from '../auth/ClayButton';

export default function FormDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  loading = false,
  submitText = 'Save',
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(21, 28, 51, 0.4)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          background: 'var(--surface)',
          boxShadow: '-8px 0 24px rgba(70, 85, 130, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid rgba(255, 255, 255, 0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid var(--divider)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', color: 'var(--text)' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.4rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={onSubmit}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {children}

          {/* Footer Submit Bar */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1.5rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              borderTop: '1px solid var(--divider)',
            }}
          >
            <ClayButton variant="secondary" onClick={onClose} disabled={loading} type="button">
              Cancel
            </ClayButton>
            <ClayButton variant="primary" loading={loading} type="submit">
              {submitText}
            </ClayButton>
          </div>
        </form>
      </div>
    </div>
  );
}
