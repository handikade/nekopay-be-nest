import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BankCreateInputSchema, BankUpdateInputSchema } from '@prisma/zod';
import { BankQueryParamsDTO } from './bank.dto';
import { BankRepository } from './bank.repository';
import { BankQueryParamsSchema } from './bank.schema';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async create(dto: unknown) {
    const validated = BankCreateInputSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.bankRepository.create(validated.data);
  }

  async findById(id: string) {
    const bank = await this.bankRepository.findById(id);

    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    return bank;
  }

  async findAll(query: BankQueryParamsDTO) {
    const validated = BankQueryParamsSchema.safeParse(query);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    const { page, limit, search, sortBy, sortOrder } = validated.data;
    const skip = (page - 1) * limit;

    const where: Prisma.BankWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.BankOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [total, data] = await this.bankRepository.findAll(where, skip, limit, orderBy);

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

  async update(id: string, dto: unknown) {
    await this.findById(id);

    const validated = BankUpdateInputSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.bankRepository.update(id, validated.data);
  }

  async delete(id: string) {
    await this.findById(id);

    return this.bankRepository.delete(id);
  }
}
