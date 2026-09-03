# רשימת קניות — React + Redux client

Screen 1 (shopping list) and screen 2 (order summary/checkout) for the
home assignment, built with React + Vite + Redux Toolkit.

## Run locally

```
npm install
npm run dev
```

Opens at http://localhost:5173.

## Structure

```
src/
  api/              mock API clients — same shape as the real backends
    catalogApi.js   mocks GET /api/categories (backend 1: .NET + SQL Server)
    ordersApi.js    mocks POST /api/orders   (backend 2: Node.js + NoSQL)
  app/
    store.js        Redux store setup
  features/
    catalog/        catalogSlice — loads & holds categories/products
    cart/           cartSlice — cart items, quantities, totals
    ui/             uiSlice — which screen is active, last order
  components/       presentational + screen components
```

## Wiring up the real backends

Once backend 1 and backend 2 are deployed, only two files need to change —
no component or slice code changes:

- `src/api/catalogApi.js` — replace the mock body of `fetchCategories()`
  with `fetch('/api/categories').then(r => r.json())`.
- `src/api/ordersApi.js` — replace the mock body of `submitOrder()` with
  `fetch('/api/orders', { method: 'POST', headers: {...}, body: JSON.stringify(orderPayload) }).then(r => r.json())`.

You'll likely also want a `.env` with `VITE_API_BASE_URL` for each backend
and a dev proxy in `vite.config.js` once real endpoints exist.
