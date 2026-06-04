import { Product, Category, StockInfo, OrderData, OrderResult, ApiResponse } from '../types';

const API_BASE = ''; // Same origin, no base needed

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return { error: errorBody.error || `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err: any) {
    return { error: err.message || 'Network error' };
  }
}

export const api = {
  getProducts: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return apiFetch<Product[]>(`/api/products${params}`);
  },
  getCategories: () => apiFetch<Category[]>('/api/categories'),
  getStock: (productId?: string) => {
    const params = productId ? `?productId=${productId}` : '';
    return apiFetch<StockInfo[]>(`/api/stock${params}`);
  },
  createOrder: (data: OrderData) => apiFetch<OrderResult>('/api/order', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  runSetup: () => apiFetch<any>('/api/setup', { method: 'POST' }),
};
