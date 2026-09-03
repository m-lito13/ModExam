import { IOrderRepository } from '../repositories/order-repository.interface';
import { IOrderService } from './order-service.interface';
import { Order, CreateOrderInput } from '../models/order.model';
import { ILogger } from '../logging/logger.interface';

interface OrderServiceDeps {
  orderRepository: IOrderRepository;
  logger: ILogger;
}

/**
 * Awilix resolves constructor params by name (CLASSIC injection mode),
 * so this class receives an object whose keys match the registrations
 * in the container (see container.ts).
 */
export class OrderService implements IOrderService {
  private readonly orderRepository: IOrderRepository;
  private readonly logger: ILogger;

  constructor({ orderRepository, logger }: OrderServiceDeps) {
    this.orderRepository = orderRepository;
    this.logger = logger;
  }

  async submitOrder(input: CreateOrderInput): Promise<Order> {
    const order = await this.orderRepository.create(input);
    this.logger.info('Order submitted', { orderId: order.id });
    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      this.logger.warn('Order not found', { orderId: id });
    }
    return order;
  }

  async listOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.findAll();
    this.logger.debug('Listed orders', { count: orders.length });
    return orders;
  }
}
