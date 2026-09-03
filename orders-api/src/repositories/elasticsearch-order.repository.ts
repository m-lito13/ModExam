import { Client } from '@elastic/elasticsearch';
import { v4 as uuidv4 } from 'uuid';
import { IOrderRepository } from './order-repository.interface';
import { Order, CreateOrderInput } from '../models/order.model';
import { isSameOrderContent } from '../models/order-equality';
import { IdempotencyConflictError } from '../errors/idempotency-conflict.error';
import { ILogger } from '../logging/logger.interface';
import { config } from '../config/env';

interface Deps {
  logger: ILogger;
}

/**
 * Elasticsearch-backed implementation of IOrderRepository, matching the
 * mapping in elasticsearch/orders-mapping.json. The index is expected to
 * already exist (created via that mapping) - this class only reads/writes
 * documents, it does not manage the index lifecycle.
 */
export class ElasticsearchOrderRepository implements IOrderRepository {
  private readonly client: Client;
  private readonly logger: ILogger;
  private readonly index: string;

  constructor({ logger }: Deps) {
    this.client = new Client({ node: config.elasticsearch.node });
    this.logger = logger;
    this.index = config.elasticsearch.ordersIndex;
  }

  async create(input: CreateOrderInput, idempotencyKey?: string): Promise<Order> {
    const order: Order = {
      id: idempotencyKey ?? uuidv4(),
      createdAt: new Date().toISOString(),
      ...input,
    };

    try {
      await this.client.index({
        index: this.index,
        id: order.id,
        document: order,
        op_type: 'create',
        refresh: 'wait_for',
      });
    } catch (err: any) {
      if (idempotencyKey && err?.meta?.statusCode === 409) {
        const existing = await this.findById(order.id);
        if (existing) {
          if (!isSameOrderContent(existing, input)) {
            throw new IdempotencyConflictError(idempotencyKey);
          }
          this.logger.info('Duplicate order submission detected, returning existing order', {
            id: order.id,
          });
          return existing;
        }
      }
      throw err;
    }

    this.logger.debug('order indexed', { id: order.id });
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const result = await this.client.get<Order>({ index: this.index, id });
      return result._source ?? null;
    } catch (err: any) {
      if (err?.meta?.statusCode === 404) {
        return null;
      }
      throw err;
    }
  }

  async findAll(): Promise<Order[]> {
    const result = await this.client.search<Order>({
      index: this.index,
      query: { match_all: {} },
    });

    return result.hits.hits
      .map((hit) => hit._source)
      .filter((doc: Order | undefined): doc is Order => doc !== undefined);
  }
}
