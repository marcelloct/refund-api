import { authConfig } from '@/configs/auth.js';
import { prisma } from '@/database/prisma.js';
import { AppError } from '@/utils/AppError.js';
import { compare } from 'bcrypt';
import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z
        .email({
          error: 'Invalid Email',
        })
        .trim(),

      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AppError('Email or Password invalid', 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or Password invalid', 401);
    }

    const { secret } = authConfig.jwt;

    const payload = { sub: user.id, role: user.role };

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
