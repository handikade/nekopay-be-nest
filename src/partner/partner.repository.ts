import { Injectable } from '@nestjs/common';
import { Partner, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePartnerDto): Promise<Partner> {
    const { contacts, partner_bank_accounts, ...partnerData } = data;

    return this.prisma.partner.create({
      data: {
        ...partnerData,
        contacts: contacts?.length
          ? {
              create: contacts,
            }
          : undefined,
        partner_bank_accounts: partner_bank_accounts?.length
          ? {
              create: partner_bank_accounts,
            }
          : undefined,
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

  async update(id: string, data: UpdatePartnerDto): Promise<Partner> {
    const { contacts, partner_bank_accounts, ...partnerData } = data;

    const updatePayload: Prisma.PartnerUpdateInput = {
      ...partnerData,
    };

    // If contacts are explicitly provided in the update DTO, we replace the existing ones.
    if (contacts !== undefined) {
      updatePayload.contacts = {
        deleteMany: {},
        create: contacts,
      };
    }

    // If bank accounts are explicitly provided in the update DTO, we replace the existing ones.
    if (partner_bank_accounts !== undefined) {
      updatePayload.partner_bank_accounts = {
        deleteMany: {},
        create: partner_bank_accounts,
      };
    }

    return this.prisma.partner.update({
      where: { id },
      data: updatePayload,
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

  async findById(id: string, includeUser: boolean = false, includeDeleted: boolean = false) {
    return this.prisma.partner.findFirst({
      where: {
        id,
        deleted_at: includeDeleted ? undefined : null,
      },
      include: {
        contacts: true,
        partner_bank_accounts: {
          include: {
            bank: true,
          },
        },
        user: includeUser
          ? {
              select: {
                id: true,
                username: true,
                email: true,
                phone_number: true,
                role: true,
              },
            }
          : false,
      },
    });
  }

  async findAll(
    whereClause: Prisma.PartnerWhereInput,
    skip?: number,
    take?: number,
    orderBy?: Prisma.PartnerOrderByWithRelationInput,
    isAdmin: boolean = false,
  ): Promise<[number, Partial<Partner>[]]> {
    const finalWhere: Prisma.PartnerWhereInput = {
      ...whereClause,
      deleted_at: null,
    };

    const select: Prisma.PartnerSelect = isAdmin
      ? {
          id: true,
          name: true,
          types: true,
          legal_entity: true,
          company_email: true,
          company_phone: true,
          provinsi_id: true,
          provinsi_label: true,
          kota_id: true,
          kota_label: true,
          kecamatan_id: true,
          kecamatan_label: true,
          kelurahan_id: true,
          kelurahan_label: true,
          address: true,
          postal_code: true,
          user_id: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        }
      : {
          id: true,
          name: true,
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
}
