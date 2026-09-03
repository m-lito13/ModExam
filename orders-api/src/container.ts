import { createContainer, asClass, AwilixContainer } from 'awilix';
import { config } from './config/env';
import { IOrderRepository } from './repositories/order-repository.interface';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { ElasticsearchOrderRepository } from './repositories/elasticsearch-order.repository';
import { IOrderService } from './services/order-service.interface';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { ILogger } from './logging/logger.interface';
import { PinoLogger } from './logging/pino-logger';

export interface Cradle {
  logger: ILogger;
  orderRepository: IOrderRepository;
  orderService: IOrderService;
  orderController: OrderController;
}

export function buildContainer(): AwilixContainer<Cradle> {
  // Default (PROXY) injection mode: each class takes a single constructor
  // arg (the cradle) and destructures the deps it needs, e.g.
  // `constructor({ orderRepository }: Deps)`.
  const container = createContainer<Cradle>();

  container.register({
    logger: asClass(PinoLogger).singleton(),
    orderService: asClass(OrderService).singleton(),
    orderController: asClass(OrderController).singleton(),
  });

  // Repository binding: pick the implementation based on DB_PROVIDER.
  if (config.dbProvider === 'elasticsearch') {
    container.register({ orderRepository: asClass(ElasticsearchOrderRepository).singleton() });
  } else {
    container.register({ orderRepository: asClass(InMemoryOrderRepository).singleton() });
  }

  return container;
}
