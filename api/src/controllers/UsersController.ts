import { prisma } from '@/database/prisma.js';
import { AppError } from '@/utils/AppError.js';
import { hash } from 'bcrypt';
import { type Request, type Response } from 'express';
import { z } from 'zod';
import { UserRole } from '../../prisma/generated/prisma/enums.js';

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string({ error: 'Name is required' })
        .trim()
        .min(2, { error: 'Name must have at least 2 characters' }),

      email: z
        .email({
          error: (issue) =>
            issue.input === undefined
              ? 'Email is required'
              : 'Not a valid email',
        })
        .trim(),

      password: z
        .string({ error: 'Password is required' })
        .trim()
        .min(6, { error: 'Password must have at least 6 digits' }),

      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) {
      throw new AppError('User with same email already exists');
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return response.status(201).json();
  }
}

export { UsersController };
