export const CONST = {
  ACCESS_TOKEN: 'access-token',
  REFRESH_TOKEN: 'refresh-token',
  USER_DATA: 'user-data',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh',
    REGISTER: 'auth/register',
  },
  USERS: {
    LIST: 'users',
    DETAIL: (id: string) => `users/${id}`,
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;