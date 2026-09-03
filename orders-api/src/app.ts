import express, { Express } from 'express';
import cors from 'cors';
import { AwilixContainer } from 'awilix';
import { Cradle } from './container';
import { createOrderRouter } from './routes/order.routes';
import { notFoundHandler, errorHandler } from './middleware/error-handler';

export function createApp(container: AwilixContainer<Cradle>): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Screen 2 - order summary/confirmation endpoints
  app.use('/api/orders', createOrderRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
