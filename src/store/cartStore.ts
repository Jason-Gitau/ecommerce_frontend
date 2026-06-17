// src/store/cartStore.ts
import { create } from 'zustand';
import type { Product } from '../types/api';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Helper to calculate totals synchronously
const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addToCart: (product) => set((state) => {
    const existing = state.items.find((i) => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = state.items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newItems = [...state.items, { ...product, quantity: 1 }];
    }
    return { items: newItems, ...calculateTotals(newItems) };
  }),

  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity < 1) return state;
    const newItems = state.items.map((i) =>
      i.id === productId ? { ...i, quantity } : i
    );
    return { items: newItems, ...calculateTotals(newItems) };
  }),

  removeFromCart: (productId) => set((state) => {
    const newItems = state.items.filter((i) => i.id !== productId);
    return { items: newItems, ...calculateTotals(newItems) };
  }),

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
}));