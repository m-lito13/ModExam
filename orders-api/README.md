# Orders Summary Backend (Screen 2)

Node.js + TypeScript + Express service for the "סיכום ההזמנה" screen.
Receives the confirmed order (customer details + chosen products) and
persists it.

## Stack

- Express (HTTP layer)
- TypeScript
- **Awilix** for dependency injection (default PROXY mode — each class
  takes one constructor arg and destructures the cradle, e.g.
  `constructor({ orderRepository })`; `container.ts` wires
  `orderRepository` → `orderService` → `orderController`)
- Zod for request validation
- Mock in-memory repository for now (`DB_PROVIDER=memory`).
  The target store is Elasticsearch — see `elasticsearch/orders-mapping.json`
  for the intended index mapping. Swapping in a real
  `ElasticsearchOrderRepository` only requires implementing
  `IOrderRepository` and registering it in `container.ts`; no other layer
  changes.

## Project layout

```
src/
├── server.ts                  entrypoint
├── app.ts                     express app + middleware wiring
├── container.ts               awilix DI container
├── config/env.ts               env var loading
├── models/order.model.ts       Order / OrderProduct types
├── validation/order.schema.ts  zod schema for POST /api/orders
├── repositories/
│   ├── order-repository.interface.ts
│   └── in-memory-order.repository.ts   (mock DB)
├── services/order.service.ts
├── controllers/order.controller.ts
├── routes/order.routes.ts
└── middleware/error-handler.ts
elasticsearch/orders-mapping.json   target ES index mapping
```

## Install & run

```bash
npm install
cp .env.example .env
npm run dev      # ts-node-dev, auto-reload
# or
npm run build && npm start
```

Server starts on `http://localhost:4000` (configurable via `PORT`).

## API

### `POST /api/orders`

Body (matches the 3 required fields on screen 2 + the products array
carried over from screen 1):

```json
{
  "fullName": "ישראל ישראלי",
  "address": "הרצל 1, תל אביב",
  "email": "israel@example.com",
  "products": [
    { "category": "חלב ומוצריו", "productName": "חלב 3%", "quantity": 2 },
    { "category": "בשר", "productName": "שוקיים", "quantity": 1 }
  ]
}
```

Responses:
- `201` — created order (with generated `id` and `createdAt`)
- `400` — validation error, with a `details` field per invalid field

### `GET /api/orders`

Lists all saved orders (helper for local testing).

### `GET /api/orders/:id`

Returns a single order or `404`.

### `GET /health`

Basic liveness check.

## Notes

- CORS is enabled for all origins for local development with the React client.
- This service only handles screen 2 (order write path). Screen 1
  (categories/products read) is served by the separate .NET backend.
