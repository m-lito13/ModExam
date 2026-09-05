import express, { Express } from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { AwilixContainer } from 'awilix';
import { Cradle } from './container';
import { createOrderRouter } from './routes/order.routes';
import { notFoundHandler, errorHandler } from './middleware/error-handler';
import { pinoInstance } from './logging/pino-instance';
import { openApiSpec } from './docs/openapi.spec';

export function createApp(container: AwilixContainer<Cradle>): Express {
  const app = express();

  app.use(pinoHttp({ logger: pinoInstance }));
  app.use(cors());
  app.use(express.json());

  app.get('/health', async (_req, res) => {
    const healthy = await container.cradle.orderRepository.checkHealth();
    res.status(healthy ? 200 : 503).json({ status: healthy ? 'ok' : 'error' });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  // Screen 2 - order summary/confirmation endpoints
  app.use('/api/orders', createOrderRouter(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
