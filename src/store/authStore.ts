// src/store/authStore.ts
import { create } from 'zustand';
import type { User } from '../types/api';
import type { ApiResponse } from '../types/api';
import api from '../lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, token) => set({ 
    user, 
    accessToken: token, 
    isAuthenticated: true,
    isLoading: false 
  }),

  logout: async () => {
    try {
      // Call backend to clear the httpOnly cookie
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed, clearing local state anyway', error);
    } finally {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (user) => set({ user }),

  checkAuth: async () => {
    try {
      if (get().accessToken) {
        // We have an in-memory token — validate it by fetching the current user
        const response = await api.get<ApiResponse<User>>('/users/me');
        set({ user: response.data, isAuthenticated: true, isLoading: false });
      } else {
        // No in-memory token (e.g. after a page refresh) — try to restore the
        // session using the httpOnly refresh_token cookie
        const refreshResponse = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
        const newToken = refreshResponse.data.accessToken;
        // Now fetch the user with the fresh token
        const userResponse = await api.get<ApiResponse<User>>('/users/me', {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        set({ user: userResponse.data, accessToken: newToken, isAuthenticated: true, isLoading: false });
      }
    } catch {
      // Refresh failed or no session — user must log in
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
