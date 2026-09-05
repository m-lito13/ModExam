/**
 * OpenAPI spec served by swagger-ui-express at /docs. Kept as a plain
 * object (rather than a YAML file) so no runtime YAML parsing dependency
 * is needed.
 */
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Orders Summary Backend',
    description:
      'Backend service for screen 2 (order summary/confirmation) - saves customer details and chosen products.',
    version: '1.0.0',
  },
  servers: [{ url: '/api' }],
  paths: {
    '/orders': {
      post: {
        summary: 'Submit an order',
        description:
          'Validates and persists an order. Supports safe retries via the Idempotency-Key header: ' +
          'sending the same key twice returns the original order instead of creating a duplicate. ' +
          'Reusing a key with different order content is treated as a conflict (409).',
        parameters: [
          {
            in: 'header',
            name: 'Idempotency-Key',
            required: false,
            schema: { type: 'string', format: 'uuid' },
            description:
              'Client-generated UUID, unique per submission attempt. Reuse the same value only when ' +
              'retrying the exact same submission (e.g. double-click, network retry); generate a new ' +
              'one for a new order.',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderInput' },
              examples: {
                default: {
                  value: {
                    fullName: 'ישראל ישראלי',
                    address: 'הרצל 1, תל אביב',
                    email: 'israel@example.com',
                    products: [
                      { category: 'חלב ומוצריו', productName: 'חלב 3%', quantity: 2 },
                      { category: 'בשר', productName: 'שוקיים', quantity: 1 },
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created (or, on an idempotent retry, the original order)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
          },
          '400': {
            description: 'Validation error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } },
          },
          '409': {
            description: 'Idempotency-Key reused with different order content',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          '500': {
            description: 'Internal server error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      get: {
        summary: 'List all orders',
        description: 'Useful for verifying saved orders during development.',
        responses: {
          '200': {
            description: 'List of orders',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
              },
            },
          },
        },
      },
    },
    '/orders/{id}': {
      get: {
        summary: 'Get an order by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'The order',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
          },
          '404': {
            description: 'Order not found',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      OrderProduct: {
        type: 'object',
        required: ['category', 'productName', 'quantity'],
        properties: {
          category: { type: 'string', minLength: 1 },
          productName: { type: 'string', minLength: 1 },
          quantity: { type: 'integer', minimum: 1 },
        },
      },
      CreateOrderInput: {
        type: 'object',
        required: ['fullName', 'address', 'email', 'products'],
        properties: {
          fullName: { type: 'string', minLength: 2 },
          address: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          products: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/OrderProduct' },
          },
        },
      },
      Order: {
        allOf: [
          { $ref: '#/components/schemas/CreateOrderInput' },
          {
            type: 'object',
            required: ['id', 'createdAt'],
            properties: {
              id: {
                type: 'string',
                description: 'Order id. Equal to the Idempotency-Key if one was supplied on creation.',
              },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'ValidationError' },
          details: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
} as const;
