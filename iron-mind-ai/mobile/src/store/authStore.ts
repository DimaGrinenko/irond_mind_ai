import { create } from 'zustand';
import { api, ApiError, getToken, setToken } from '../api/client';

export type AppRole = 'USER' | 'COACH' | 'ADMIN';

export type AuthState = {
  token: string | null;
  hydrating: boolean;
  online: boolean;
  email: string | null;
  name: string | null;
  role: AppRole;
  serverUserId: string | null;

  hydrate: () => Promise<void>;
  register: (email: string, password: string, name: string, goal?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isCoach: () => boolean;
};

function mapRole(r?: string): AppRole {
  if (r === 'ADMIN' || r === 'COACH' || r === 'USER') return r;
  return 'USER';
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  hydrating: true,
  online: false,
  email: null,
  name: null,
  role: 'USER',
  serverUserId: null,

  hydrate: async () => {
    const t = await getToken();
    if (!t) {
      set({ hydrating: false, token: null, online: false, role: 'USER', serverUserId: null });
      return;
    }
    try {
      const me = await api.auth.me();
      set({
        token: t,
        hydrating: false,
        online: true,
        email: me?.email ?? null,
        name: me?.name ?? null,
        role: mapRole(me?.role),
        serverUserId: me?.id ?? null,
      });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        await setToken(null);
        set({ token: null, hydrating: false, online: false, email: null, name: null, role: 'USER', serverUserId: null });
      } else {
        set({ token: t, hydrating: false, online: false });
      }
    }
  },

  register: async (email, password, name, goal) => {
    const r = await api.auth.register({ email, password, name, goal });
    await setToken(r.token);
    set({
      token: r.token,
      online: true,
      email: r.user.email,
      name: r.user.name,
      role: mapRole(r.user.role),
      serverUserId: r.user.id,
    });
  },

  login: async (email, password) => {
    const r = await api.auth.login({ email, password });
    await setToken(r.token);
    set({
      token: r.token,
      online: true,
      email: r.user.email,
      name: r.user.name,
      role: mapRole(r.user.role),
      serverUserId: r.user.id,
    });
    return r.user;
  },

  logout: async () => {
    await setToken(null);
    set({ token: null, online: false, email: null, name: null, role: 'USER', serverUserId: null });
  },

  isAdmin: () => get().role === 'ADMIN',
  isCoach: () => get().role === 'COACH' || get().role === 'ADMIN',
}));
