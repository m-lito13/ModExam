import { Order, CreateOrderInput } from '../models/order.model';

/**
 * Persistence contract for orders. The service/controller layers only
 * depend on this interface, so the mock in-memory implementation can be
 * swapped for a real Elasticsearch-backed one (see
 * elasticsearch/orders-mapping.json) without changing any other code -
 * just register a different class under the "orderRepository" token in
 * the DI container.
 */
export interface IOrderRepository {
  create(input: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
}
