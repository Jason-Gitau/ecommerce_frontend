// src/lib/api.ts
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useAuthStore } from '../store/authStore';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // CRITICAL: Sends the httpOnly refresh_token cookie to /api/auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach Access Token + Logging
client.interceptors.request.use((config) => {
  // Get token from Zustand store
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Log outgoing requests
  console.log(`[API] ${config.method?.toUpperCase() || 'REQUEST'} ${config.baseURL}${config.url}`, {
    data: config.data,
    headers: Object.fromEntries(
      Object.entries(config.headers).filter(([k]) => !k.toLowerCase().includes('authorization'))
    ),
    timestamp: new Date().toISOString(),
  });

  return config;
});

// 2. Response Interceptor: Handle 401 Unauthorized with silent token refresh
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

client.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`, {
      data: response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  async (error: AxiosError) => {
    console.error(`[API] ❌ ${error.response?.status || 'NO_RESPONSE'} ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`, {
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isRefreshCall = originalRequest.url?.includes('/auth/refresh');

    // Never attempt a silent refresh for the refresh endpoint itself — that
    // would create an infinite 401 loop. Just let the error propagate so the
    // caller (checkAuth) can handle it cleanly.
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing) {
        // Queue this request until the in-flight refresh completes
        return new Promise((resolve) => {
          refreshQueue.push((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            resolve(client(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token via the httpOnly refresh cookie
        const refreshRes = await client.post<{ data: { accessToken: string } }>('/auth/refresh');
        const newToken = refreshRes.data.data.accessToken;

        // Persist the new token in the store
        useAuthStore.setState({ accessToken: newToken, isAuthenticated: true });

        // Flush queued requests with the new token
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        // Retry the original request with the fresh token
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return client(originalRequest);
      } catch {
        // Refresh itself failed — session is truly dead
        refreshQueue = [];
        useAuthStore.getState().logout();
        // Only redirect if not already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return client.get<T, AxiosResponse<T>>(url, config).then((response) => response.data);
  },
  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return client.post<T, AxiosResponse<T>, D>(url, data, config).then((response) => response.data);
  },
  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return client.put<T, AxiosResponse<T>, D>(url, data, config).then((response) => response.data);
  },
  patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return client.patch<T, AxiosResponse<T>, D>(url, data, config).then((response) => response.data);
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return client.delete<T, AxiosResponse<T>>(url, config).then((response) => response.data);
  },
};

export default api;
