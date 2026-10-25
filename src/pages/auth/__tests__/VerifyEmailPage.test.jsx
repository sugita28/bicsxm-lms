import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../test/mocks/server';
import VerifyEmailPage from '../VerifyEmailPage';

describe('VerifyEmailPage Component', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  it('renders 6 individual OTP digit boxes', () => {
    render(
      <MemoryRouter>
        <VerifyEmailPage role="student" />
      </MemoryRouter>,
    );

    const digitInputs = screen.getAllByRole('textbox', { name: /digit/i });
    expect(digitInputs).toHaveLength(6);
  });

  it('displays resend cooldown countdown and disables resend button initially', () => {
    render(
      <MemoryRouter>
        <VerifyEmailPage role="student" />
      </MemoryRouter>,
    );

    const resendBtn = screen.getByRole('button', { name: /resend/i });
    expect(resendBtn).toBeDisabled();
    expect(resendBtn).toHaveTextContent(/Resend code in/i);
  });

  it('submits 6-digit OTP successfully', async () => {
    let verifyPayload = null;
    server.use(
      http.post('/api/student/auth/verify-otp/', async ({ request }) => {
        verifyPayload = await request.json();
        return HttpResponse.json({
          status: 'ACTIVE',
          scope: 'full',
          message: 'Verified',
        });
      }),
    );

    render(
      <MemoryRouter>
        <VerifyEmailPage role="student" />
      </MemoryRouter>,
    );

    const digitInputs = screen.getAllByRole('textbox', { name: /digit/i });
    for (let i = 0; i < 6; i++) {
      await userEvent.type(digitInputs[i], `${i + 1}`);
    }

    const submitBtn = screen.getByRole('button', { name: /verify code/i });
    expect(submitBtn).toBeEnabled();
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(verifyPayload).toEqual({ otp: '123456' });
    });
  });

  it('displays lockout notice when max attempts are exceeded', async () => {
    server.use(
      http.post('/api/student/auth/verify-otp/', () => {
        return new HttpResponse(
          JSON.stringify({
            error: {
              code: 'OTP_MAX_ATTEMPTS',
              message: 'Maximum attempts exceeded.',
            },
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    render(
      <MemoryRouter>
        <VerifyEmailPage role="student" />
      </MemoryRouter>,
    );

    const digitInputs = screen.getAllByRole('textbox', { name: /digit/i });
    for (let i = 0; i < 6; i++) {
      await userEvent.type(digitInputs[i], '9');
    }

    const submitBtn = screen.getByRole('button', { name: /verify code/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/This code has been locked/i)).toBeInTheDocument();
    });
  });
});
