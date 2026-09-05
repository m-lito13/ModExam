import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../../src/services/order.service';
import { IOrderRepository } from '../../src/repositories/order-repository.interface';
import { ILogger } from '../../src/logging/logger.interface';
import { CreateOrderInput, Order } from '../../src/models/order.model';

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order-1',
    createdAt: '2026-01-01T00:00:00.000Z',
    fullName: 'Jane Doe',
    address: '123 Main St',
    email: 'jane@example.com',
    products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
    ...overrides,
  };
}

function makeInput(): CreateOrderInput {
  const { id, createdAt, ...input } = makeOrder();
  return input;
}

describe('OrderService', () => {
  let orderRepository: IOrderRepository;
  let logger: ILogger;
  let service: OrderService;

  beforeEach(() => {
    orderRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      checkHealth: vi.fn(),
    };
    logger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    service = new OrderService({ orderRepository, logger });
  });

  describe('submitOrder', () => {
    it('delegates creation to the repository and returns the created order', async () => {
      const created = makeOrder();
      (orderRepository.create as any).mockResolvedValue(created);

      const result = await service.submitOrder(makeInput(), 'idem-key');

      expect(orderRepository.create).toHaveBeenCalledWith(makeInput(), 'idem-key');
      expect(result).toBe(created);
    });

    it('logs the submitted order id', async () => {
      const created = makeOrder({ id: 'order-42' });
      (orderRepository.create as any).mockResolvedValue(created);

      await service.submitOrder(makeInput());

      expect(logger.info).toHaveBeenCalledWith('Order submitted', { orderId: 'order-42' });
    });
  });

  describe('getOrderById', () => {
    it('returns the order when found', async () => {
      const found = makeOrder();
      (orderRepository.findById as any).mockResolvedValue(found);

      const result = await service.getOrderById('order-1');

      expect(result).toBe(found);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('returns null and logs a warning when not found', async () => {
      (orderRepository.findById as any).mockResolvedValue(null);

      const result = await service.getOrderById('missing');

      expect(result).toBeNull();
      expect(logger.warn).toHaveBeenCalledWith('Order not found', { orderId: 'missing' });
    });
  });

  describe('listOrders', () => {
    it('returns all orders from the repository', async () => {
      const orders = [makeOrder(), makeOrder({ id: 'order-2' })];
      (orderRepository.findAll as any).mockResolvedValue(orders);

      const result = await service.listOrders();

      expect(result).toBe(orders);
      expect(logger.debug).toHaveBeenCalledWith('Listed orders', { count: 2 });
    });
  });
});
