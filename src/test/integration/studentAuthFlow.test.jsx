import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import RoleGuard from '../../components/RoleGuard';
import SignupPage from '../../pages/auth/SignupPage';
import VerifyEmailPage from '../../pages/auth/VerifyEmailPage';
import StudentDashboard from '../../pages/student/StudentDashboard';
import { useAuthStore } from '../../store/authStore';
import { server } from '../mocks/server';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/student/signup']}>
      <Routes>
        <Route path="/student/signup" element={<SignupPage role="student" />} />
        <Route path="/student/verify-email" element={<VerifyEmailPage role="student" />} />
        <Route
          path="/student/dashboard"
          element={
            <RoleGuard role="student">
              <StudentDashboard />
            </RoleGuard>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Student Complete Auth Integration Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({
      student: { user: null, status: null, scope: null, loading: false, initialized: true },
    });
  });

  it('completes signup -> OTP verification -> student dashboard', async () => {
    server.use(
      http.post('/api/student/auth/signup/', async () => {
        return HttpResponse.json(
          {
            message: 'Verification code sent',
            status: 'EMAIL_UNVERIFIED',
            scope: 'limited',
          },
          { status: 201 },
        );
      }),

      http.post('/api/student/auth/verify-otp/', async () => {
        return HttpResponse.json({
          message: 'Verified',
          status: 'ACTIVE',
          scope: 'full',
          user: {
            id: 'uuid-1',
            email: 'student@example.com',
            full_name: 'Alex Student',
            role: 'STUDENT',
          },
        });
      }),

      http.get('/api/student/dashboard/ping/', () => {
        return HttpResponse.json({ role: 'student', message: 'pong' });
      }),
    );

    renderApp();

    // 1. Fill out signup form
    await userEvent.type(screen.getByLabelText(/Full Name/i), 'Alex Student');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'student@example.com');
    await userEvent.type(screen.getByLabelText(/^Password/i), 'SecurePass123!');
    await userEvent.type(screen.getByLabelText(/Confirm Password/i), 'SecurePass123!');

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // 2. Transition to Verify Email page
    await waitFor(() => {
      expect(screen.getByText(/Verify Your Email/i)).toBeInTheDocument();
    });

    // 3. Enter 6-digit OTP
    const digitInputs = screen.getAllByRole('textbox', { name: /digit/i });
    for (let i = 0; i < 6; i++) {
      await userEvent.type(digitInputs[i], '1');
    }

    fireEvent.click(screen.getByRole('button', { name: /Verify Code/i }));

    // 4. Lands on Student Dashboard with user details and ping
    await waitFor(() => {
      expect(screen.getByText('Alex Student')).toBeInTheDocument();
      expect(screen.getByText('student@example.com')).toBeInTheDocument();
      expect(screen.getByText(/Protected API Authorization Proof/i)).toBeInTheDocument();
    });
  });
});
