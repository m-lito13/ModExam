export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
}

export interface CartItem {
  productId: number;
  categoryId: number | null;
  name: string;
  price: number;
  quantity: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
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

export type Screen = 'shopping' | 'summary' | 'confirmation';
