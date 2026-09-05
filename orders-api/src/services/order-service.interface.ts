import { Order, CreateOrderInput } from '../models/order.model';

export interface IOrderService {
  submitOrder(input: CreateOrderInput, idempotencyKey?: string): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
}
