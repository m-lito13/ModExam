import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { OrderController } from '../../src/controllers/order.controller';
import { IOrderService } from '../../src/services/order-service.interface';
import { Order } from '../../src/models/order.model';

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

function makeResponse(): Response {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe('OrderController', () => {
  let orderService: IOrderService;
  let controller: OrderController;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    orderService = {
      submitOrder: vi.fn(),
      getOrderById: vi.fn(),
      listOrders: vi.fn(),
    };
    controller = new OrderController({ orderService });
    res = makeResponse();
    next = vi.fn();
  });

  describe('submitOrder', () => {
    function makeRequest(body: unknown, idempotencyHeader?: string): Request {
      return {
        body,
        get: vi.fn().mockReturnValue(idempotencyHeader),
      } as unknown as Request;
    }

    it('returns 400 with field errors when the body is invalid', async () => {
      const req = makeRequest({ fullName: '', address: '', email: 'bad', products: [] });

      await controller.submitOrder(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'ValidationError' })
      );
      expect(orderService.submitOrder).not.toHaveBeenCalled();
    });

    it('creates the order and returns 201 on valid input', async () => {
      const created = makeOrder();
      (orderService.submitOrder as any).mockResolvedValue(created);
      const req = makeRequest({
        fullName: 'Jane Doe',
        address: '123 Main St',
        email: 'jane@example.com',
        products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
      });

      await controller.submitOrder(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    it('trims and forwards the Idempotency-Key header', async () => {
      (orderService.submitOrder as any).mockResolvedValue(makeOrder());
      const req = makeRequest(
        {
          fullName: 'Jane Doe',
          address: '123 Main St',
          email: 'jane@example.com',
          products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
        },
        '  my-key  '
      );

      await controller.submitOrder(req, res, next);

      expect(orderService.submitOrder).toHaveBeenCalledWith(expect.anything(), 'my-key');
    });

    it('passes undefined when no Idempotency-Key header is present', async () => {
      (orderService.submitOrder as any).mockResolvedValue(makeOrder());
      const req = makeRequest({
        fullName: 'Jane Doe',
        address: '123 Main St',
        email: 'jane@example.com',
        products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
      });

      await controller.submitOrder(req, res, next);

      expect(orderService.submitOrder).toHaveBeenCalledWith(expect.anything(), undefined);
    });

    it('forwards errors from the service to next', async () => {
      const error = new Error('boom');
      (orderService.submitOrder as any).mockRejectedValue(error);
      const req = makeRequest({
        fullName: 'Jane Doe',
        address: '123 Main St',
        email: 'jane@example.com',
        products: [{ category: 'books', productName: 'Novel', quantity: 1 }],
      });

      await controller.submitOrder(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getOrder', () => {
    function makeRequest(id: string): Request {
      return { params: { id } } as unknown as Request;
    }

    it('returns 200 with the order when found', async () => {
      const found = makeOrder();
      (orderService.getOrderById as any).mockResolvedValue(found);

      await controller.getOrder(makeRequest('order-1'), res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(found);
    });

    it('returns 404 when not found', async () => {
      (orderService.getOrderById as any).mockResolvedValue(null);

      await controller.getOrder(makeRequest('missing'), res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'NotFound' })
      );
    });

    it('forwards errors to next', async () => {
      const error = new Error('boom');
      (orderService.getOrderById as any).mockRejectedValue(error);

      await controller.getOrder(makeRequest('order-1'), res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listOrders', () => {
    it('returns 200 with all orders', async () => {
      const orders = [makeOrder(), makeOrder({ id: 'order-2' })];
      (orderService.listOrders as any).mockResolvedValue(orders);

      await controller.listOrders({} as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(orders);
    });

    it('forwards errors to next', async () => {
      const error = new Error('boom');
      (orderService.listOrders as any).mockRejectedValue(error);

      await controller.listOrders({} as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
