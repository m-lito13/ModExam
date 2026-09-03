// API client for backend 2 (Node.js + MongoDB/Elasticsearch).
// Real endpoint contract: POST /api/orders
//   body -> { firstName, lastName, address, email, items: [{ productId, productName, categoryId, quantity }] }
//   response -> { orderId, status, createdAt }
// Swap the body of submitOrder for a real fetch() call once the backend
// is deployed; the request/response shapes below already match the contract.

const MOCK_DELAY_MS = 600;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateOrderId() {
  return 'ord_' + Math.random().toString(36).slice(2, 10);
}

export async function submitOrder(orderPayload) {
  await delay(MOCK_DELAY_MS);

  // Simulated server-side validation, mirroring what backend 2 should enforce.
  const required = ['firstName', 'lastName', 'address', 'email'];
  const missing = required.filter((field) => !orderPayload[field]?.trim());
  if (missing.length > 0) {
    throw new Error(`שדות חובה חסרים: ${missing.join(', ')}`);
  }
  if (!orderPayload.items || orderPayload.items.length === 0) {
    throw new Error('לא ניתן לשלוח הזמנה ריקה');
  }

  return {
    orderId: generateOrderId(),
    status: 'created',
    createdAt: new Date().toISOString(),
  };
}
