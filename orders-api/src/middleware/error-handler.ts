import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: 'NotFound', message: `Route ${req.method} ${req.path} not found` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) {
  req.log.error(err);
  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'InternalServerError' : err.name,
    message: err.message,
  });
}
