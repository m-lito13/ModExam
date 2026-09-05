export interface Product {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  productId: number;
  categoryId: number | null;
  name: string;
  price: number;
  quantity: number;
  stockQuantity: number;
}

export interface Customer {
  fullName: string;
  address: string;
  email: string;
}

export interface OrderResult {
  orderId: string;
  status: string;
  createdAt: string;
}

export interface LastOrder extends OrderResult {
  customer: Customer;
  items: CartItem[];
  total: number;
}

export const SCREEN = {
  SHOPPING: 'shopping',
  SUMMARY: 'summary',
  CONFIRMATION: 'confirmation',
} as const;

export type Screen = (typeof SCREEN)[keyof typeof SCREEN];
