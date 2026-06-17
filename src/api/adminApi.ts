// src/api/adminApi.ts
import api from '../lib/api';
import type { ApiResponse, PaginationMeta } from '../types/api';

// --- Analytics ---
export interface AdminOverview {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  lowStockAlerts: number;
}

export const getAdminOverview = async () => {
  const response = await api.get<ApiResponse<AdminOverview>>('/admin/analytics/overview');
  return response.data;
};

export interface RevenueChart {
  labels: string[];
  data: number[];
}

export const getAdminRevenue = async (days: number = 7) => {
  const response = await api.get<ApiResponse<RevenueChart>>('/admin/analytics/revenue', { params: { days } });
  return response.data;
};

// --- Users ---
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isBanned: boolean;
  createdAt: string;
}

export interface GetAdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'USER' | 'ADMIN';
  status?: 'active' | 'banned';
}

export const getAdminUsers = async (params: GetAdminUsersParams) => {
  const response = await api.get<ApiResponse<AdminUser[], PaginationMeta>>('/admin/users', { params });
  return response; // Returns { data: AdminUser[], meta: PaginationMeta }
};

// Function to update a user (used for Banning/Unbanning)
export const updateAdminUser = async (id: string, data: Partial<AdminUser> & { adminNotes?: string }) => {
  const response = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, data);
  return response.data;
};

// --- Orders ---
export interface AdminOrder {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string }; // If populated by backend
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'FAILED';

export const getAdminOrders = async (params: { page?: number; limit?: number }) => {
  const response = await api.get<ApiResponse<AdminOrder[], PaginationMeta>>('/admin/orders', { params });
  return response;
};


export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const response = await api.patch<ApiResponse<AdminOrder>>(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export interface ExportOrdersParams {
  startDate?: string; // ISO format
  endDate?: string;   // ISO format
  status?: OrderStatus;
}


export const exportOrdersCSV = async (params: ExportOrdersParams) => {
  // responseType: 'blob' tells Axios to treat this as a raw file, bypassing JSON parsing
  const response = await api.get('/admin/orders/export/csv', { 
    params,
    responseType: 'blob' 
  });
  return response; // Returns the raw Axios response containing the Blob
};