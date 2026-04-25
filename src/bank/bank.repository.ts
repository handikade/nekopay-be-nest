import { Injectable } from '@nestjs/common';
import { Bank, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BankRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BankCreateInput): Promise<Bank> {
    return this.prisma.bank.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BankUpdateInput): Promise<Bank> {
    return this.prisma.bank.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Bank | null> {
    return this.prisma.bank.findUnique({
      where: { id },
    });
  }

  async findAll(
    whereClause: Prisma.BankWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.BankOrderByWithRelationInput,
  ): Promise<[number, Bank[]]> {
    return this.prisma.$transaction([
      this.prisma.bank.count({ where: whereClause }),
      this.prisma.bank.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
      }),
    ]);
  }

  async delete(id: string): Promise<Bank> {
    return this.prisma.bank.delete({
      where: { id },
    });
  }
}
