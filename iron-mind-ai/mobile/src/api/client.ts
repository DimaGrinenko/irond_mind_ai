/**
 * Тонкий fetch-клиент к backend.
 * Базовый URL берётся из EXPO_PUBLIC_API_URL (см. .env / app.json -> extra),
 * по умолчанию — локальный backend на 4001.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'ai_trainer_token';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:4001').replace(
  /\/$/,
  '',
);

let cachedToken: string | null = null;

export async function getToken(): Promise<string | null> {
  if (cachedToken !== null) return cachedToken;
  const v = await AsyncStorage.getItem(TOKEN_KEY);
  cachedToken = v;
  return v;
}

export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ReqInit = Omit<RequestInit, 'body'> & { body?: unknown };

export async function request<T = unknown>(path: string, init: ReqInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message = (data && (data as any).message) || res.statusText || 'Request failed';
    throw new ApiError(Array.isArray(message) ? message.join(', ') : String(message), res.status, data);
  }

  return data as T;
}

function safeJson(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

export const api = {
  auth: {
    register: (b: { email: string; password: string; name: string; goal?: string }) =>
      request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: b }),
    login: (b: { email: string; password: string }) =>
      request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: b }),
    me: () => request<any>('/auth/me'),
  },
  users: {
    me: () => request<any>('/users/me'),
    update: (b: Record<string, unknown>) => request<any>('/users/me', { method: 'PATCH', body: b }),
  },
  programs: {
    list: () => request<any[]>('/programs'),
  },
  workouts: {
    list: (limit?: number) => request<any[]>(`/workouts${limit ? `?limit=${limit}` : ''}`),
    create: (b: Record<string, unknown>) => request<any>('/workouts', { method: 'POST', body: b }),
    finish: (id: string) => request<any>(`/workouts/${id}/finish`, { method: 'PATCH' }),
    upsertSet: (id: string, b: Record<string, unknown>) =>
      request<any>(`/workouts/${id}/sets`, { method: 'POST', body: b }),
  },
  measurements: {
    list: () => request<any[]>('/measurements'),
    create: (b: Record<string, unknown>) => request<any>('/measurements', { method: 'POST', body: b }),
  },
  nutrition: {
    list: (date?: string) => request<any[]>(`/nutrition${date ? `?date=${date}` : ''}`),
    create: (b: Record<string, unknown>) => request<any>('/nutrition', { method: 'POST', body: b }),
  },
  chat: {
    list: () => request<any[]>('/chat'),
    send: (content: string) => request<any>('/chat', { method: 'POST', body: { content } }),
  },
  stats: {
    me: (days?: number) => request<any>(`/stats/me${days ? `?days=${days}` : ''}`),
    platform: () => request<any>('/stats/platform'),
  },
  admin: {
    users: () => request<any[]>('/admin/users'),
    setRole: (id: string, role: string) =>
      request<any>(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } }),
    assignCoach: (clientId: string, coachId: string, notes?: string) =>
      request<any>(`/admin/clients/${clientId}/coach`, { method: 'POST', body: { coachId, notes } }),
  },
  coach: {
    clients: () => request<any[]>('/coach/clients'),
    client: (id: string) => request<any>(`/coach/clients/${id}`),
    setNotes: (id: string, notes: string) =>
      request<any>(`/coach/clients/${id}/notes`, { method: 'PATCH', body: { notes } }),
  },
};
