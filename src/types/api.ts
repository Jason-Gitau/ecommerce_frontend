// src/types/api.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified?: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface ApiResponse<T, M = unknown> {
  success: boolean;
  data: T;
  meta?: M;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

// Strong password regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export interface PaginationMeta {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
