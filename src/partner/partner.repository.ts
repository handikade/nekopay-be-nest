import { Injectable } from '@nestjs/common';
import { Partner, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PartnerCreateInput): Promise<Partner> {
    return this.prisma.partner.create({
      data: data,
      include: {
        contacts: true,
        partner_bank_accounts: {
          include: {
            bank: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.PartnerUpdateInput): Promise<Partner> {
    return this.prisma.partner.update({
      where: { id },
      data,
      include: {
        contacts: true,
        partner_bank_accounts: {
          include: {
            bank: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.partner.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        contacts: true,
        partner_bank_accounts: {
          include: {
            bank: true,
          },
        },
      },
    });
  }

  async findAll(
    whereClause: Prisma.PartnerWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.PartnerOrderByWithRelationInput,
  ): Promise<[number, Partial<Partner>[]]> {
    const finalWhere: Prisma.PartnerWhereInput = {
      ...whereClause,
      deleted_at: null,
    };

    const select: Prisma.PartnerSelect = {
      id: true,
      name: true,
      number: true,
      types: true,
      legal_entity: true,
      company_email: true,
      company_phone: true,
      created_at: true,
      updated_at: true,
    };

    return this.prisma.$transaction([
      this.prisma.partner.count({ where: finalWhere }),
      this.prisma.partner.findMany({
        where: finalWhere,
        skip,
        take,
        orderBy,
        select,
      }),
    ]);
  }

  async delete(id: string): Promise<Partner> {
    return this.prisma.partner.update({
      where: { id },
      data: { deleted_at: new Date() },
      include: {
        contacts: true,
        partner_bank_accounts: {
          include: {
            bank: true,
          },
        },
      },
    });
  }

  async restore(id: string): Promise<Partner> {
    return this.prisma.partner.update({
      where: { id },
      data: { deleted_at: null },
      include: {
        contacts: true,
        partner_bank_accounts: {
          include: {
            bank: true,
          },
        },
      },
    });
  }

  async findLatestNumber(userId: string): Promise<string | null> {
    const latestPartner = await this.prisma.partner.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        number: true,
      },
    });

    return latestPartner?.number || null;
  }
}
