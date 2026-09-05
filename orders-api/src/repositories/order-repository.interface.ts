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
  /**
   * When idempotencyKey is provided, it is used as the order id so that a
   * retried request with the same key returns the original order instead
   * of creating a duplicate.
   */
  create(input: CreateOrderInput, idempotencyKey?: string): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;

  /**
   * Used by the /health endpoint. Should resolve false (not throw) when the
   * backing store is unreachable, so the caller can report a 503 instead of
   * letting the error surface as an unrelated failure.
   */
  checkHealth(): Promise<boolean>;
}
