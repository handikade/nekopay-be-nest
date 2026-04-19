import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaxQueryDto, TaxQuerySchema } from './dto/tax-query.dto';
import { TaxRepository } from './tax.repository';

@Injectable()
export class TaxService {
  constructor(private readonly taxRepository: TaxRepository) {}

  async findAll(query: TaxQueryDto) {
    const validated = TaxQuerySchema.safeParse(query);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    const { page, limit, search, sortBy, sortOrder } = validated.data;
    const skip = (page - 1) * limit;

    const where: Prisma.TaxWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const orderBy: Prisma.TaxOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [total, data] = await this.taxRepository.findAll(where, skip, limit, orderBy);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const tax = await this.taxRepository.findById(id);

    if (!tax) {
      throw new NotFoundException('Tax not found');
    }

    return tax;
  }
}
