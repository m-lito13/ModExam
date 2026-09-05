import { v4 as uuidv4 } from 'uuid';
import { IOrderRepository } from './order-repository.interface';
import { Order, CreateOrderInput } from '../models/order.model';
import { isSameOrderContent } from '../models/order-equality';
import { IdempotencyConflictError } from '../errors/idempotency-conflict.error';

/**
 * Mock/in-memory implementation of IOrderRepository, used while the real
 * Elasticsearch store is not wired up yet. Data lives only for the
 * lifetime of the process - fine for local development and for
 * exercising the API end to end.
 */
export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders = new Map<string, Order>();

  async create(input: CreateOrderInput, idempotencyKey?: string): Promise<Order> {
    const id = idempotencyKey ?? uuidv4();

    const existing = this.orders.get(id);
    if (existing) {
      if (idempotencyKey && !isSameOrderContent(existing, input)) {
        throw new IdempotencyConflictError(idempotencyKey);
      }
      return existing;
    }

    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.orders.set(order.id, order);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async checkHealth(): Promise<boolean> {
    return true;
  }
}
