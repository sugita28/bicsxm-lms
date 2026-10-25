import axios from 'axios';
import { normalizeError } from './errors';

/**
 * Utility to extract a cookie value by name from document.cookie.
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Endpoints that should NEVER be automatically retried with token refresh.
 */
const NON_RETRYABLE_PATTERNS = [
  '/auth/login/',
  '/auth/signup/',
  '/auth/token/refresh/',
  '/auth/verify-otp/',
  '/auth/resend-otp/',
  '/auth/password-reset/',
];

export function isNonRetryableUrl(url = '') {
  return NON_RETRYABLE_PATTERNS.some((pattern) => url.includes(pattern));
}

// Track single-flight refresh per role
const refreshState = {
  student: { isRefreshing: false, queue: [] },
  teacher: { isRefreshing: false, queue: [] },
  admin: { isRefreshing: false, queue: [] },
};

function processQueue(role, error = null) {
  const state = refreshState[role];
  if (!state) return;

  state.queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  state.queue = [];
}

/**
 * Creates a configured Axios client instance for a given role (student, teacher, admin).
 *
 * @param {('student'|'teacher'|'admin')} role
 * @param {Object} [options]
 * @returns {import('axios').AxiosInstance}
 */
export function createRoleApi(role, options = {}) {
  const roleName = role.toLowerCase();
  const csrfCookieName = `${roleName}_csrf`;

  const instance = axios.create({
    baseURL: options.baseURL || `/api/${roleName}`,
    withCredentials: true,
    timeout: options.timeout || 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });

  // Request interceptor: attach role-specific CSRF token to unsafe methods
  instance.interceptors.request.use(
    (config) => {
      const method = (config.method || 'get').toUpperCase();
      const isUnsafeMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

      if (isUnsafeMethod) {
        const csrfToken = getCookie(csrfCookieName);
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
      }

      return config;
    },
    (error) => Promise.reject(normalizeError(error)),
  );

  // Response interceptor: single-flight refresh on 401
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error?.response?.status;

      // Only attempt refresh on 401 Unauthorized
      if (status !== 401 || !originalRequest) {
        return Promise.reject(normalizeError(error));
      }

      // Never retry non-retryable endpoints (login, signup, refresh, otp, password reset)
      if (isNonRetryableUrl(originalRequest.url || '')) {
        return Promise.reject(normalizeError(error));
      }

      // Avoid infinite retry loop
      if (originalRequest._retry) {
        return Promise.reject(normalizeError(error));
      }

      const state = refreshState[roleName] || { isRefreshing: false, queue: [] };
      refreshState[roleName] = state;

      // If already refreshing, wait for single-flight resolution
      if (state.isRefreshing) {
        return new Promise((resolve, reject) => {
          state.queue.push({
            resolve: () => resolve(instance(originalRequest)),
            reject: (err) => reject(normalizeError(err)),
          });
        });
      }

      originalRequest._retry = true;
      state.isRefreshing = true;

      try {
        // Attempt token refresh for this role
        await instance.post('/auth/token/refresh/');

        // Process queued calls
        processQueue(roleName, null);

        // Retry original request
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(roleName, refreshError);

        // Dispatch role session expiration event for UI/Zustand store listeners
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('auth:session-expired', {
              detail: { role: roleName },
            }),
          );
        }

        return Promise.reject(normalizeError(refreshError));
      } finally {
        state.isRefreshing = false;
      }
    },
  );

  return instance;
}
