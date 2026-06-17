// src/api/productApi.ts
import api from '../lib/api';
import type { ApiResponse, PaginationMeta, Product } from '../types/api';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export const getProducts = async (params: GetProductsParams) => {
  // The axios interceptor automatically unwraps the envelope, 
  // so this returns { success: true, data: Product[], meta: PaginationMeta }
  const response = await api.get<ApiResponse<Product[], PaginationMeta>>('/products', { 
    params: {
      limit: 12, // Nice number for a grid layout
      ...params,
      // Convert boolean to string for URL query params
      inStock: params.inStock !== undefined ? String(params.inStock) : undefined,
    } 
  });
  return response;
};

export const getProductById = async (id: string) => {
  // The interceptor unwraps the envelope, so response.data is directly the Product
  const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data;
};


export const createProduct = async (data: { name: string; price: number; stock?: number }) => {
  const response = await api.post<ApiResponse<Product>>('/products', data);
  return response.data;
};
export const updateProduct = async (id: string, data: Partial<{ name: string; price: number; stock: number }>) => {
  const response = await api.patch<ApiResponse<Product>>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/products/${id}`);
  return response.data;
};