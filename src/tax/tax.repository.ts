import { Injectable } from '@nestjs/common';
import { Prisma, Tax } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaxRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    whereClause: Prisma.TaxWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.TaxOrderByWithRelationInput,
  ): Promise<[number, Tax[]]> {
    return this.prisma.$transaction([
      this.prisma.tax.count({ where: whereClause }),
      this.prisma.tax.findMany({
        where: whereClause,
        skip,
        take,
        orderBy,
      }),
    ]);
  }

  async findById(id: string): Promise<Tax | null> {
    return this.prisma.tax.findUnique({
      where: { id },
    });
  }
}
