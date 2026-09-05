import { Request, Response, NextFunction } from 'express';
import { IOrderService } from '../services/order-service.interface';
import { createOrderSchema } from '../validation/order.schema';

interface OrderControllerDeps {
  orderService: IOrderService;
}

export class OrderController {
  private readonly orderService: IOrderService;

  constructor({ orderService }: OrderControllerDeps) {
    this.orderService = orderService;
  }

  // POST /api/orders  ("אשר הזמנה" on screen 2)
  submitOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parseResult = createOrderSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          error: 'ValidationError',
          details: parseResult.error.flatten().fieldErrors,
        });
      }

      const idempotencyKey = req.get('Idempotency-Key')?.trim() || undefined;
      const order = await this.orderService.submitOrder(parseResult.data, idempotencyKey);
      return res.status(201).json(order);
    } catch (err) {
      return next(err);
    }
  };

  // GET /api/orders/:id
  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'NotFound', message: 'Order not found' });
      }
      return res.status(200).json(order);
    } catch (err) {
      return next(err);
    }
  };

  // GET /api/orders  (useful for verifying saved orders during development)
  listOrders = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.listOrders();
      return res.status(200).json(orders);
    } catch (err) {
      return next(err);
    }
  };
}
