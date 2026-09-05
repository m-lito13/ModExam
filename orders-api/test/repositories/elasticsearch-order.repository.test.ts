import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockIndex, mockGet, mockSearch, mockPing } = vi.hoisted(() => ({
  mockIndex: vi.fn(),
  mockGet: vi.fn(),
  mockSearch: vi.fn(),
  mockPing: vi.fn(),
}));

vi.mock('@elastic/elasticsearch', () => ({
  Client: vi.fn().mockImplementation(() => ({
    index: mockIndex,
    get: mockGet,
    search: mockSearch,
    ping: mockPing,
  })),
}));

import { ElasticsearchOrderRepository } from '../../src/repositories/elasticsearch-order.repository';
import { IdempotencyConflictError } from '../../src/errors/idempotency-conflict.error';
import { ILogger } from '../../src/logging/logger.interface';
import { CreateOrderInput, Order } from '../../src/models/order.model';
import { config } from '../../src/config/env';

function input(overrides: Partial<CreateOrderInput> = {}): CreateOrderInput {
  return {
    fullName: 'Jane Doe',
    address: '123 Main St',
    email: 'jane@example.com',
    products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
    ...overrides,
  };
}

function esError(statusCode: number): any {
  const err: any = new Error(`es error ${statusCode}`);
  err.meta = { statusCode };
  return err;
}

describe('ElasticsearchOrderRepository', () => {
  let logger: ILogger;
  let repository: ElasticsearchOrderRepository;

  beforeEach(() => {
    mockIndex.mockReset();
    mockGet.mockReset();
    mockSearch.mockReset();
    mockPing.mockReset();
    logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    repository = new ElasticsearchOrderRepository({ logger });
  });

  describe('create', () => {
    it('indexes the order and returns it', async () => {
      mockIndex.mockResolvedValue({});

      const result = await repository.create(input());

      const callArg = mockIndex.mock.calls[0][0];
      expect(callArg.index).toBe(config.elasticsearch.ordersIndex);
      expect(callArg.op_type).toBe('create');
      expect(callArg.refresh).toBe('wait_for');
      expect(callArg.id).toBe(result.id);
      expect(callArg.document).toEqual(result);
      expect(result.fullName).toBe('Jane Doe');
      expect(result.id).toBeTruthy();
      expect(logger.debug).toHaveBeenCalledWith('order indexed', { id: result.id });
    });

    it('uses the idempotency key as the order id', async () => {
      mockIndex.mockResolvedValue({});

      const result = await repository.create(input(), 'my-key');

      expect(result.id).toBe('my-key');
      expect(mockIndex).toHaveBeenCalledWith(expect.objectContaining({ id: 'my-key' }));
    });

    it('returns the existing order on a 409 conflict with identical content', async () => {
      mockIndex.mockRejectedValue(esError(409));
      const existing: Order = {
        id: 'my-key',
        createdAt: '2026-01-01T00:00:00.000Z',
        ...input(),
      };
      mockGet.mockResolvedValue({ _source: existing });

      const result = await repository.create(input(), 'my-key');

      expect(mockGet).toHaveBeenCalledWith({ index: config.elasticsearch.ordersIndex, id: 'my-key' });
      expect(result).toEqual(existing);
      expect(logger.info).toHaveBeenCalledWith(
        'Duplicate order submission detected, returning existing order',
        { id: 'my-key' }
      );
    });

    it('throws IdempotencyConflictError on a 409 conflict with different content', async () => {
      mockIndex.mockRejectedValue(esError(409));
      const existing: Order = {
        id: 'my-key',
        createdAt: '2026-01-01T00:00:00.000Z',
        ...input({ fullName: 'Someone Else' }),
      };
      mockGet.mockResolvedValue({ _source: existing });

      await expect(repository.create(input(), 'my-key')).rejects.toThrow(IdempotencyConflictError);
    });

    it('rethrows the original error when a 409 conflict has no existing document', async () => {
      const conflict = esError(409);
      mockIndex.mockRejectedValue(conflict);
      mockGet.mockRejectedValue(esError(404));

      await expect(repository.create(input(), 'my-key')).rejects.toBe(conflict);
    });

    it('rethrows a non-409 error without checking for an existing document', async () => {
      const serverError = esError(500);
      mockIndex.mockRejectedValue(serverError);

      await expect(repository.create(input(), 'my-key')).rejects.toBe(serverError);
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('rethrows a 409 error when no idempotency key was provided', async () => {
      const conflict = esError(409);
      mockIndex.mockRejectedValue(conflict);

      await expect(repository.create(input())).rejects.toBe(conflict);
      expect(mockGet).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('returns the source document when found', async () => {
      const order: Order = { id: 'order-1', createdAt: '2026-01-01T00:00:00.000Z', ...input() };
      mockGet.mockResolvedValue({ _source: order });

      const result = await repository.findById('order-1');

      expect(mockGet).toHaveBeenCalledWith({ index: config.elasticsearch.ordersIndex, id: 'order-1' });
      expect(result).toEqual(order);
    });

    it('returns null on a 404', async () => {
      mockGet.mockRejectedValue(esError(404));

      const result = await repository.findById('missing');

      expect(result).toBeNull();
    });

    it('rethrows non-404 errors', async () => {
      const serverError = esError(500);
      mockGet.mockRejectedValue(serverError);

      await expect(repository.findById('order-1')).rejects.toBe(serverError);
    });
  });

  describe('findAll', () => {
    it('maps hits to their source documents', async () => {
      const orderA: Order = { id: 'a', createdAt: '2026-01-01T00:00:00.000Z', ...input() };
      const orderB: Order = { id: 'b', createdAt: '2026-01-02T00:00:00.000Z', ...input() };
      mockSearch.mockResolvedValue({
        hits: { hits: [{ _source: orderA }, { _source: orderB }] },
      });

      const result = await repository.findAll();

      expect(mockSearch).toHaveBeenCalledWith({
        index: config.elasticsearch.ordersIndex,
        query: { match_all: {} },
      });
      expect(result).toEqual([orderA, orderB]);
    });

    it('filters out hits without a source', async () => {
      mockSearch.mockResolvedValue({
        hits: { hits: [{ _source: undefined }] },
      });

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it('returns an empty array when there are no hits', async () => {
      mockSearch.mockResolvedValue({ hits: { hits: [] } });

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('checkHealth', () => {
    it('returns true when ping resolves true', async () => {
      mockPing.mockResolvedValue(true);

      await expect(repository.checkHealth()).resolves.toBe(true);
    });

    it('returns false when ping resolves false', async () => {
      mockPing.mockResolvedValue(false);

      await expect(repository.checkHealth()).resolves.toBe(false);
    });

    it('returns false and logs an error when ping rejects', async () => {
      const pingError = new Error('unreachable');
      mockPing.mockRejectedValue(pingError);

      await expect(repository.checkHealth()).resolves.toBe(false);
      expect(logger.error).toHaveBeenCalledWith(
        'Elasticsearch health check failed',
        expect.objectContaining({ err: pingError })
      );
    });
  });
});
