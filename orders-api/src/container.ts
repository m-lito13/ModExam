import { createContainer, asClass, AwilixContainer } from 'awilix';
import { config } from './config/env';
import { IOrderRepository } from './repositories/order-repository.interface';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';

export interface Cradle {
  orderRepository: IOrderRepository;
  orderService: OrderService;
  orderController: OrderController;
}

export function buildContainer(): AwilixContainer<Cradle> {
  // Default (PROXY) injection mode: each class takes a single constructor
  // arg (the cradle) and destructures the deps it needs, e.g.
  // `constructor({ orderRepository }: Deps)`.
  const container = createContainer<Cradle>();

  // Repository binding: pick the implementation based on DB_PROVIDER.
  // Only "memory" is implemented today; "elasticsearch" is the seam left
  // for the real store described in elasticsearch/orders-mapping.json.
  if (config.dbProvider === 'elasticsearch') {
    throw new Error(
      'DB_PROVIDER=elasticsearch is not implemented yet. ' +
        'Implement an ElasticsearchOrderRepository (IOrderRepository) and register it here, ' +
        'or set DB_PROVIDER=memory to use the mock store.'
    );
  }

  container.register({
    orderRepository: asClass(InMemoryOrderRepository).singleton(),
    orderService: asClass(OrderService).singleton(),
    orderController: asClass(OrderController).singleton(),
  });

  return container;
}
