import { ILogger } from './logger.interface';
import { pinoInstance } from './pino-instance';

// Adapts pino's (meta, message) argument order to the app's ILogger
// (message, meta) shape, so callers don't depend on pino directly and
// swapping in a different backend (console, winston) only means writing
// another ILogger implementation.
export class PinoLogger implements ILogger {
  debug(message: string, meta?: Record<string, unknown>): void {
    pinoInstance.debug(meta ?? {}, message);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    pinoInstance.info(meta ?? {}, message);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    pinoInstance.warn(meta ?? {}, message);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    pinoInstance.error(meta ?? {}, message);
  }
}
