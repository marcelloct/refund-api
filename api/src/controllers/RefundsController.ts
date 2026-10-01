import { prisma } from '@/database/prisma.js';
import { AppError } from '@/utils/AppError.js';
import { type Request, type Response } from 'express';
import { z } from 'zod';

const CategoriesEnum = z.enum([
  'food',
  'services',
  'transport',
  'accommodation',
  'others',
]);

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string({ error: 'Inform a name for your solicitation' })
        .trim()
        .min(2, { error: 'Solicitation must have at least 2 characters' }),

      category: CategoriesEnum,
      amount: z.number().positive({ error: 'Amount must be a positive value' }),
      filename: z.string().min(2),
    });

    const { name, category, amount, filename } = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError('Unauthorized', 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    });

    return response.status(201).json(refund);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(''),
      // pagination
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(request.query);

    // Calculate 'skip' value for pagination
    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim().toLowerCase(),
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    // Obtain the total of registers for calculate the number of pages
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim().toLowerCase(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    return response.json({
      refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }
}

export { RefundsController };
