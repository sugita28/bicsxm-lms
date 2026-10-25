import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../../store/authStore';
import RoleGuard from '../RoleGuard';

function renderGuarded(role, initialPath = `/${role}/dashboard`) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={`/${role}/login`} element={<div>Login Page</div>} />
        <Route path={`/${role}/verify-email`} element={<div>Verify Email Page</div>} />
        <Route path={`/${role}/pending-approval`} element={<div>Pending Approval Page</div>} />
        <Route path={`/${role}/rejected`} element={<div>Rejected Page</div>} />
        <Route
          path={`/${role}/dashboard`}
          element={
            <RoleGuard role={role}>
              <div>Protected Dashboard Content</div>
            </RoleGuard>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RoleGuard Component', () => {
  beforeEach(() => {
    useAuthStore.setState({
      student: { user: null, status: null, scope: null, loading: false, initialized: true },
      teacher: { user: null, status: null, scope: null, loading: false, initialized: true },
      admin: { user: null, status: null, scope: null, loading: false, initialized: true },
    });
  });

  it('renders loading state when session is not yet initialized', () => {
    useAuthStore.setState({
      student: { user: null, status: null, scope: null, loading: true, initialized: false },
    });

    renderGuarded('student');
    expect(screen.getByTestId('role-guard-loading')).toBeInTheDocument();
  });

  it('redirects to login when unauthenticated', () => {
    renderGuarded('student');
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to verify-email when status is EMAIL_UNVERIFIED', () => {
    useAuthStore.setState({
      student: {
        user: { id: '1', email: 's@test.com' },
        status: 'EMAIL_UNVERIFIED',
        scope: 'limited',
        initialized: true,
      },
    });

    renderGuarded('student');
    expect(screen.getByText('Verify Email Page')).toBeInTheDocument();
  });

  it('redirects to pending-approval when teacher status is PENDING_APPROVAL', () => {
    useAuthStore.setState({
      teacher: {
        user: { id: '2', email: 't@test.com' },
        status: 'PENDING_APPROVAL',
        scope: 'limited',
        initialized: true,
      },
    });

    renderGuarded('teacher');
    expect(screen.getByText('Pending Approval Page')).toBeInTheDocument();
  });

  it('redirects to rejected when teacher status is REJECTED', () => {
    useAuthStore.setState({
      teacher: {
        user: { id: '2', email: 't@test.com' },
        status: 'REJECTED',
        scope: 'limited',
        initialized: true,
      },
    });

    renderGuarded('teacher');
    expect(screen.getByText('Rejected Page')).toBeInTheDocument();
  });

  it('redirects to verify-email when ACTIVE with limited token scope', () => {
    useAuthStore.setState({
      student: {
        user: { id: '1', email: 's@test.com' },
        status: 'ACTIVE',
        scope: 'limited',
        initialized: true,
      },
    });

    renderGuarded('student');
    expect(screen.getByText('Verify Email Page')).toBeInTheDocument();
  });

  it('renders protected dashboard children when ACTIVE with full scope', () => {
    useAuthStore.setState({
      student: {
        user: { id: '1', email: 's@test.com' },
        status: 'ACTIVE',
        scope: 'full',
        initialized: true,
      },
    });

    renderGuarded('student');
    expect(screen.getByText('Protected Dashboard Content')).toBeInTheDocument();
  });
});
