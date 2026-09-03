import { IOrderRepository } from '../repositories/order-repository.interface';
import { Order, CreateOrderInput } from '../models/order.model';

interface OrderServiceDeps {
  orderRepository: IOrderRepository;
}

/**
 * Awilix resolves constructor params by name (CLASSIC injection mode),
 * so this class receives an object whose keys match the registrations
 * in the container (see container.ts).
 */
export class OrderService {
  private readonly orderRepository: IOrderRepository;

  constructor({ orderRepository }: OrderServiceDeps) {
    this.orderRepository = orderRepository;
  }

  async submitOrder(input: CreateOrderInput): Promise<Order> {
    return this.orderRepository.create(input);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async listOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
