import { create } from 'zustand';
import { adminApi, studentApi, teacherApi } from '../api';

const roleApis = {
  student: studentApi,
  teacher: teacherApi,
  admin: adminApi,
};

const initialRoleState = {
  user: null,
  status: null, // EMAIL_UNVERIFIED, PENDING_APPROVAL, REJECTED, ACTIVE
  scope: null,  // limited, full
  loading: false,
  initialized: false,
  error: null,
};

export const useAuthStore = create((set, get) => ({
  student: { ...initialRoleState },
  teacher: { ...initialRoleState },
  admin: { ...initialRoleState },

  /**
   * Hydrates a role's auth state by requesting GET /auth/me/.
   * Catches 401 silently when not logged in.
   */
  hydrate: async (role) => {
    const roleKey = role.toLowerCase();
    const api = roleApis[roleKey];
    if (!api) return;

    set((state) => ({
      [roleKey]: { ...state[roleKey], loading: true, error: null },
    }));

    try {
      const response = await api.get('/auth/me/');
      const data = response.data;

      set((state) => ({
        [roleKey]: {
          ...state[roleKey],
          user: data,
          status: data.status || 'ACTIVE',
          scope: data.scope || 'full',
          loading: false,
          initialized: true,
          error: null,
        },
      }));
      return data;
    } catch {
      // 401 or network error on me -> not logged in
      set((state) => ({
        [roleKey]: {
          ...state[roleKey],
          user: null,
          status: null,
          scope: null,
          loading: false,
          initialized: true,
          error: null,
        },
      }));
      return null;
    }
  },

  /**
   * Hydrates all three roles concurrently on initial application load.
   */
  hydrateAll: async () => {
    await Promise.allSettled([
      get().hydrate('student'),
      get().hydrate('teacher'),
      get().hydrate('admin'),
    ]);
  },

  /**
   * Sets auth credentials upon successful login, signup, or OTP verification.
   */
  setAuth: (role, { user, status, scope }) => {
    const roleKey = role.toLowerCase();
    set((state) => ({
      [roleKey]: {
        ...state[roleKey],
        user: user !== undefined ? user : state[roleKey].user,
        status: status !== undefined ? status : state[roleKey].status,
        scope: scope !== undefined ? scope : state[roleKey].scope,
        initialized: true,
        loading: false,
        error: null,
      },
    }));
  },

  /**
   * Logs out the user from a specific role and clears its state.
   */
  logout: async (role) => {
    const roleKey = role.toLowerCase();
    const api = roleApis[roleKey];

    try {
      if (api) {
        await api.post('/auth/logout/');
      }
    } catch {
      // Ignore logout API failures, ensure state is cleared regardless
    } finally {
      set(() => ({
        [roleKey]: {
          ...initialRoleState,
          initialized: true,
        },
      }));
    }
  },

  /**
   * Resets a role's state immediately upon session expiration.
   */
  resetRole: (role) => {
    const roleKey = role.toLowerCase();
    set(() => ({
      [roleKey]: {
        ...initialRoleState,
        initialized: true,
      },
    }));
  },
}));

// Global listener for session expiration dispatched by axiosFactory
if (typeof window !== 'undefined') {
  window.addEventListener('auth:session-expired', (e) => {
    const role = e.detail?.role;
    if (role && useAuthStore.getState().resetRole) {
      useAuthStore.getState().resetRole(role);
    }
  });
}
