import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import RoleGuard from '../../components/RoleGuard';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminLoginPage from '../../pages/admin/AdminLoginPage';
import AdminOtpPage from '../../pages/admin/AdminOtpPage';
import { useAuthStore } from '../../store/authStore';
import { server } from '../mocks/server';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/admin/login']}>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/login/verify-otp" element={<AdminOtpPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <RoleGuard role="admin">
              <AdminDashboard />
            </RoleGuard>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Admin Two-Step Login Integration Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({
      admin: { user: null, status: null, scope: null, loading: false, initialized: true },
    });
  });

  it('completes Step 1 (credentials) -> Step 2 (OTP) -> admin dashboard', async () => {
    server.use(
      http.post('/api/admin/auth/login/', async () => {
        return HttpResponse.json({
          requires_otp: true,
          message: 'OTP sent to admin email',
        });
      }),

      http.post('/api/admin/auth/login/verify-otp/', async () => {
        return HttpResponse.json({
          status: 'ACTIVE',
          scope: 'full',
          user: {
            id: 'admin-uuid',
            email: 'admin@lms.local',
            full_name: 'Lead Administrator',
            role: 'ADMIN',
          },
        });
      }),

      http.get('/api/admin/dashboard/ping/', () => {
        return HttpResponse.json({ role: 'admin', message: 'pong' });
      }),
      http.get('/api/admin/users/', () => {
        return HttpResponse.json({ count: 5, results: [] });
      }),
      http.get('/api/admin/teachers/', () => {
        return HttpResponse.json([]);
      }),
    );

    renderApp();

    // 1. Enter Admin Step 1 Credentials
    await userEvent.type(screen.getByLabelText(/Administrator Email/i), 'admin@lms.local');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'AdminPassword123!');

    fireEvent.click(screen.getByRole('button', { name: /Continue to Step 2/i }));

    // 2. Transformed to Step 2 OTP Screen
    await waitFor(() => {
      expect(screen.getByText(/Two-Factor Authentication/i)).toBeInTheDocument();
      expect(screen.getByText(/admin@lms.local/i)).toBeInTheDocument();
    });

    // 3. Enter 6-digit OTP
    const digitInputs = screen.getAllByRole('textbox', { name: /digit/i });
    for (let i = 0; i < 6; i++) {
      await userEvent.type(digitInputs[i], `${i + 1}`);
    }

    fireEvent.click(screen.getByRole('button', { name: /Authenticate & Enter Dashboard/i }));

    // 4. Lands on Admin Dashboard
    await waitFor(() => {
      expect(screen.getByText(/System Administration/i)).toBeInTheDocument();
      expect(screen.getByText(/Root Administrator Authorization Ping/i)).toBeInTheDocument();
    });
  });
});
