// API client for backend 2 (Node.js + MongoDB/Elasticsearch).
// POST /api/orders
//   body -> { fullName, address, email, products: [{ category, productName, quantity }] }
//   response (201) -> { id, fullName, address, email, products, createdAt }
//   response (400) -> { error: 'ValidationError', details: Record<string, string[]> }

import type { Customer, OrderResult } from '../types';

const BASE_URL = import.meta.env.VITE_ORDER_API_URL;

export interface OrderPayload extends Customer {
  products: Array<{
    category: string;
    productName: string;
    quantity: number;
  }>;
}

interface OrderDto {
  id: string;
  createdAt: string;
}

interface ValidationErrorDto {
  error: string;
  details?: Record<string, string[]>;
  message?: string;
}

export async function submitOrder(orderPayload: OrderPayload): Promise<OrderResult> {
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const errorBody: ValidationErrorDto = await response.json().catch(() => ({ error: 'UnknownError' }));
    const message = errorBody.details
      ? Object.values(errorBody.details).flat().join(', ')
      : errorBody.message ?? `שגיאה בשליחת ההזמנה (${response.status})`;
    throw new Error(message);
  }

  const order: OrderDto = await response.json();

  return {
    orderId: order.id,
    status: 'created',
    createdAt: order.createdAt,
  };
}
