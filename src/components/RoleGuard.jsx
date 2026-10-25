import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Route guard component that protects role-specific dashboard and authenticated routes.
 * Redirects dynamically based on effective account status and token scope.
 *
 * @param {Object} props
 * @param {('student'|'teacher'|'admin')} props.role
 * @param {React.ReactNode} props.children
 */
export default function RoleGuard({ role, children }) {
  const roleKey = role.toLowerCase();
  const location = useLocation();
  const { user, status, scope, initialized, loading } = useAuthStore(
    (state) => state[roleKey] || {},
  );
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    if (!initialized && !loading) {
      hydrate(roleKey);
    }
  }, [initialized, loading, roleKey, hydrate]);

  // While checking / hydrating session, display a rich claymorphic loading screen
  if (!initialized || loading) {
    return (
      <div
        data-testid="role-guard-loading"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          fontFamily: 'var(--font-display, Figtree, sans-serif)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '4px solid #cad1dc',
            borderTopColor: 'var(--accent, #2f55ff)',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem' }}>
          Verifying session...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user && !status) {
    return (
      <Navigate
        to={`/${roleKey}/login`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Handle specific account statuses
  if (status === 'EMAIL_UNVERIFIED') {
    return <Navigate to={`/${roleKey}/verify-email`} replace />;
  }

  if (status === 'PENDING_APPROVAL') {
    return <Navigate to={`/${roleKey}/pending-approval`} replace />;
  }

  if (status === 'REJECTED') {
    return <Navigate to={`/${roleKey}/rejected`} replace />;
  }

  // For ACTIVE accounts, ensure full token scope is present
  if (status === 'ACTIVE') {
    if (scope !== 'full') {
      return <Navigate to={`/${roleKey}/verify-email`} replace />;
    }
    return children;
  }

  // Default fallback if unknown status: redirect to login
  return <Navigate to={`/${roleKey}/login`} replace />;
}
