import { AppError } from '@/utils/AppError.js';
import {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { z, ZodError } from 'zod';

export const errorHandling: ErrorRequestHandler = (
  error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }
  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ message: 'Validation Error:', issues: z.treeifyError(error) });
  }
  return response.status(500).json({ message: error.message });
};
