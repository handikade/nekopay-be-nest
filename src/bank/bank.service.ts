import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BankRepository } from './bank.repository';
import { CreateBankDto, CreateBankSchema } from './dto/create-bank.dto';
import { FindAllBankDto, FindAllBankSchema } from './dto/find-all-bank.dto';
import { UpdateBankDto, UpdateBankSchema } from './dto/update-bank.dto';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async create(user: UserPayload, dto: CreateBankDto) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create banks');
    }

    const validated = CreateBankSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.bankRepository.create(validated.data as CreateBankDto);
  }

  async findById(id: string) {
    const bank = await this.bankRepository.findById(id);

    if (!bank) {
      throw new NotFoundException('Bank not found');
    }

    return bank;
  }

  async findAll(user: UserPayload, query: FindAllBankDto) {
    const validated = FindAllBankSchema.safeParse(query);
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

  async update(id: string, user: UserPayload, dto: UpdateBankDto) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can update banks');
    }

    await this.findById(id);

    const validated = UpdateBankSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.bankRepository.update(id, validated.data as UpdateBankDto);
  }

  async delete(id: string, user: UserPayload) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admin can delete banks');
    }

    await this.findById(id);

    return this.bankRepository.delete(id);
  }
}
