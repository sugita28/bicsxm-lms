import { Loader2 } from 'lucide-react';

/**
 * Claymorphic button matching LMS theme design tokens.
 *
 * @param {Object} props
 * @param {('primary'|'secondary'|'danger')} [props.variant='primary']
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.fullWidth=true]
 * @param {React.ReactNode} props.children
 */
export default function ClayButton({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  type = 'button',
  style,
  onClick,
  ...props
}) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  let bg = 'var(--surface)';
  let color = 'var(--text)';
  let shadow = 'var(--shadow-raised-sm)';

  if (isPrimary) {
    bg = 'var(--accent, #2f55ff)';
    color = '#ffffff';
    shadow = 'var(--shadow-clay-accent)';
  } else if (isDanger) {
    bg = 'var(--danger, #b3342a)';
    color = '#ffffff';
    shadow = 'var(--shadow-raised-sm)';
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.85rem 1.5rem',
        fontSize: '0.975rem',
        fontWeight: '600',
        fontFamily: 'var(--font-display, Figtree, sans-serif)',
        borderRadius: 'var(--r-full, 9999px)',
        border: 'none',
        background: bg,
        color: color,
        boxShadow: shadow,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      {...props}
    >
      {loading && <Loader2 size={18} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
}
