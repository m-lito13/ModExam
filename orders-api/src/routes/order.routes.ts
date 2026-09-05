import { Router, Request, Response, NextFunction } from 'express';
import { AwilixContainer } from 'awilix';
import { Cradle } from '../container';

export function createOrderRouter(container: AwilixContainer<Cradle>): Router {
  const router = Router();

  // Small helper so each handler resolves the (singleton) controller
  // from the container instead of importing a concrete instance.
  const controller = () => container.cradle.orderController;

  router.post('/', (req: Request, res: Response, next: NextFunction) =>
    controller().submitOrder(req, res, next)
  );

  router.get('/', (req: Request, res: Response, next: NextFunction) =>
    controller().listOrders(req, res, next)
  );

  router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
    controller().getOrder(req, res, next)
  );

  return router;
}
