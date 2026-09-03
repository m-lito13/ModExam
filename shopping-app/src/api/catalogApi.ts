// API client for backend 1 (.NET 10 + SQL Server).
// Real endpoint contract: GET /api/categories
//   -> [{ id, name, products: [{ id, name, price, unit }] }]
// Swap MOCK_DELAY_MS / mockCategories for a real fetch call once the
// backend is deployed — the shape returned below already matches the
// contract, so no other code needs to change.

import type { Category } from '../types';

const MOCK_DELAY_MS = 450;

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'חלב ומוצריו',
    products: [
      { id: 101, name: 'קוטג׳', price: 6.9, unit: 'יחידה' },
      { id: 102, name: 'חלב 3%', price: 5.5, unit: 'ליטר' },
      { id: 103, name: 'שמנת חמוצה', price: 4.2, unit: 'יחידה' },
      { id: 104, name: 'גבינה צהובה', price: 12.9, unit: '200 גרם' },
    ],
  },
  {
    id: 2,
    name: 'בשר ודגים',
    products: [
      { id: 201, name: 'חזה עוף', price: 39.9, unit: 'ק"ג' },
      { id: 202, name: 'בשר טחון', price: 54.0, unit: 'ק"ג' },
      { id: 203, name: 'פילה סלמון', price: 69.9, unit: 'ק"ג' },
    ],
  },
  {
    id: 3,
    name: 'ירקות ופירות',
    products: [
      { id: 301, name: 'עגבניות', price: 6.5, unit: 'ק"ג' },
      { id: 302, name: 'מלפפונים', price: 5.9, unit: 'ק"ג' },
      { id: 303, name: 'תפוחים', price: 8.9, unit: 'ק"ג' },
      { id: 304, name: 'בננות', price: 7.5, unit: 'ק"ג' },
    ],
  },
  {
    id: 4,
    name: 'מאפים ולחם',
    products: [
      { id: 401, name: 'לחם מלא', price: 9.9, unit: 'יחידה' },
      { id: 402, name: 'פיתות', price: 6.0, unit: 'חבילה' },
      { id: 403, name: 'בגט', price: 7.9, unit: 'יחידה' },
    ],
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchCategories(): Promise<Category[]> {
  await delay(MOCK_DELAY_MS);
  return JSON.parse(JSON.stringify(mockCategories));
}
