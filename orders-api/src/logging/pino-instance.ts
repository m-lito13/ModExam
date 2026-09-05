import pino from 'pino';
import { config } from '../config/env';

// Raw pino instance. Exported separately from ILogger because pino-http
// (request logging middleware in app.ts) needs the concrete pino API,
// not the app-level ILogger abstraction.
export const pinoInstance = pino({
  level: process.env.LOG_LEVEL ?? (config.nodeEnv === 'production' ? 'info' : 'debug'),
  transport:
    config.nodeEnv === 'production'
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
});
