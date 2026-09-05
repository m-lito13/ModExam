import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryOrderRepository } from '../../src/repositories/in-memory-order.repository';
import { IdempotencyConflictError } from '../../src/errors/idempotency-conflict.error';
import { CreateOrderInput } from '../../src/models/order.model';

function input(overrides: Partial<CreateOrderInput> = {}): CreateOrderInput {
  return {
    fullName: 'Jane Doe',
    address: '123 Main St',
    email: 'jane@example.com',
    products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
    ...overrides,
  };
}

describe('InMemoryOrderRepository', () => {
  let repository: InMemoryOrderRepository;

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
  });

  it('creates an order with a generated id when no idempotency key is given', async () => {
    const order = await repository.create(input());
    expect(order.id).toBeTruthy();
    expect(order.fullName).toBe('Jane Doe');
    expect(order.createdAt).toBeTruthy();
  });

  it('uses the idempotency key as the order id', async () => {
    const order = await repository.create(input(), 'my-key');
    expect(order.id).toBe('my-key');
  });

  it('returns the existing order on a duplicate idempotency key with identical content', async () => {
    const first = await repository.create(input(), 'my-key');
    const second = await repository.create(input(), 'my-key');
    expect(second).toEqual(first);
  });

  it('throws IdempotencyConflictError when the same key is reused with different content', async () => {
    await repository.create(input(), 'my-key');
    await expect(
      repository.create(input({ fullName: 'Someone Else' }), 'my-key')
    ).rejects.toThrow(IdempotencyConflictError);
  });

  it('creates separate orders for different idempotency keys', async () => {
    const first = await repository.create(input(), 'key-1');
    const second = await repository.create(input(), 'key-2');
    expect(first.id).not.toBe(second.id);
  });

  it('finds an order by id', async () => {
    const created = await repository.create(input());
    const found = await repository.findById(created.id);
    expect(found).toEqual(created);
  });

  it('returns null when finding a nonexistent id', async () => {
    const found = await repository.findById('missing');
    expect(found).toBeNull();
  });

  it('lists all created orders', async () => {
    await repository.create(input(), 'key-1');
    await repository.create(input(), 'key-2');
    const all = await repository.findAll();
    expect(all).toHaveLength(2);
  });

  it('reports healthy', async () => {
    await expect(repository.checkHealth()).resolves.toBe(true);
  });
});
