// src/api/orderApi.ts
import api from '../lib/api';
import type { ApiResponse, PaginationMeta } from '../types/api';

export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'FAILED';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtTime: number;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

export interface UserOrder {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export const getUserOrders = async (params: { page?: number; limit?: number }) => {
  const response = await api.get<ApiResponse<UserOrder[], PaginationMeta>>('/orders', { params });
  return response; // Returns { data: UserOrder[], meta: PaginationMeta }
};

export const getOrderById = async (id: string) => {
  const response = await api.get<ApiResponse<UserOrder>>(`/orders/${id}`);
  return response.data;
};