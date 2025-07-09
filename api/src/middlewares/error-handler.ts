
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  res.status(status).json({ error: message });
}
