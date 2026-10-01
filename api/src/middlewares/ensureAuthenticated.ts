import { authConfig } from '@/configs/auth.js';
import { AppError } from '@/utils/AppError.js';
import { type NextFunction, type Request, type Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

// Define the payload structure expected from the token
interface TokenPayload extends JwtPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token not found', 401);
  }

  const [, token] = authHeader.split(' ');

  if (!authConfig.jwt.secret) {
    throw new AppError('JWT secret key is not configured', 500);
  }

  // Guard clause to ensure token exists and satisfies string type
  if (!token) {
    throw new AppError('JWT Token formatted improperly', 401);
  }
  try {
    const { role, sub: user_id } = jwt.verify(
      token,
      authConfig.jwt.secret
    ) as unknown as TokenPayload;

    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT Token', 401);
  }
}

export { ensureAuthenticated };
