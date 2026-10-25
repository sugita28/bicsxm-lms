import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '../../test/mocks/server';
import { studentApi } from '../studentApi';

describe('Axios Client & Interceptor Architecture', () => {
  beforeEach(() => {
    document.cookie = '';
  });

  it('attaches role-specific CSRF token on unsafe state-mutating requests', async () => {
    document.cookie = 'student_csrf=test_student_csrf_token_123; path=/';

    let capturedHeader = null;
    server.use(
      http.post('/api/student/test-post/', ({ request }) => {
        capturedHeader = request.headers.get('X-CSRFToken');
        return HttpResponse.json({ success: true });
      }),
    );

    const res = await studentApi.post('/test-post/', { foo: 'bar' });
    expect(res.data.success).toBe(true);
    expect(capturedHeader).toBe('test_student_csrf_token_123');
  });

  it('performs single-flight token refresh on concurrent 401 responses', async () => {
    let pingAttempts = 0;
    let refreshCalls = 0;

    server.use(
      http.get('/api/student/dashboard/ping/', () => {
        pingAttempts++;
        if (pingAttempts <= 3) {
          // First 3 calls fail with 401
          return new HttpResponse(
            JSON.stringify({ error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return HttpResponse.json({ role: 'student', message: 'pong' });
      }),

      http.post('/api/student/auth/token/refresh/', () => {
        refreshCalls++;
        return HttpResponse.json({ status: 'ACTIVE', scope: 'full' });
      }),
    );

    // Fire 3 simultaneous concurrent API calls
    const [res1, res2, res3] = await Promise.all([
      studentApi.get('/dashboard/ping/'),
      studentApi.get('/dashboard/ping/'),
      studentApi.get('/dashboard/ping/'),
    ]);

    expect(res1.data.message).toBe('pong');
    expect(res2.data.message).toBe('pong');
    expect(res3.data.message).toBe('pong');

    // Crucial check: refresh endpoint must be called exactly ONCE (deduplication)
    expect(refreshCalls).toBe(1);
  });

  it('does not attempt token refresh on non-retryable URLs (e.g. login, verify-otp)', async () => {
    let refreshCalls = 0;

    server.use(
      http.post('/api/student/auth/login/', () => {
        return new HttpResponse(
          JSON.stringify({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),
      http.post('/api/student/auth/token/refresh/', () => {
        refreshCalls++;
        return HttpResponse.json({ status: 'ACTIVE', scope: 'full' });
      }),
    );

    await expect(studentApi.post('/auth/login/', { email: 'bad@example.com', password: 'bad' }))
      .rejects.toThrow();

    expect(refreshCalls).toBe(0);
  });

  it('dispatches auth:session-expired event when token refresh fails', async () => {
    server.use(
      http.get('/api/student/protected-endpoint/', () => {
        return new HttpResponse(null, { status: 401 });
      }),
      http.post('/api/student/auth/token/refresh/', () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    const sessionExpiredListener = vi.fn();
    window.addEventListener('auth:session-expired', sessionExpiredListener);

    await expect(studentApi.get('/protected-endpoint/')).rejects.toThrow();

    expect(sessionExpiredListener).toHaveBeenCalled();
    window.removeEventListener('auth:session-expired', sessionExpiredListener);
  });
});
