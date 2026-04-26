import { Injectable, NotFoundException } from '@nestjs/common';
import { PartnerType, Prisma } from '@prisma/client';
import { incrementDocNumber } from '@src/_core/utils/increment-doc-number.util';
import { PartnerCreateDTO, PartnerQueryDTO, PartnerUpdateDTO } from './partner.dto';
import { PartnerRepository } from './partner.repository';
import {
  PartnerCreateSchema,
  PartnerIdSchema,
  PartnerListSchema,
  PartnerPresentationSchema,
  PartnerQuerySchema,
  PartnerUpdateSchema,
} from './partner.schema';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async create(userId: string, dto: PartnerCreateDTO) {
    const parsed = PartnerCreateSchema.parse(dto);
    let { number } = parsed;
    if (!number) {
      const { number: nextNumber } = await this.getNextNumber(userId);
      number = nextNumber;
    }

    const payload: Prisma.PartnerCreateInput = {
      ...parsed,
      number,
      user: {
        connect: { id: userId },
      },
      contacts: dto.contacts
        ? {
            create: dto.contacts,
          }
        : undefined,
      partner_bank_accounts: dto.partner_bank_accounts
        ? {
            create: dto.partner_bank_accounts,
          }
        : undefined,
    };

    const result = await this.partnerRepository.create(payload);
    return PartnerIdSchema.parse(result);
  }

  async update(id: string, userId: string, dto: PartnerUpdateDTO) {
    await this.findByIdAndUserId({ id, userId });

    const parsed = PartnerUpdateSchema.parse(dto);
    const { contacts, partner_bank_accounts, ...partnerData } = parsed;

    const payload: Prisma.PartnerUpdateInput = {
      ...partnerData,
    };

    if (contacts) {
      const idsToKeep = contacts.map((c) => c.id).filter((cid): cid is string => !!cid);
      payload.contacts = {
        deleteMany: {
          id: { notIn: idsToKeep },
        },
        create: contacts
          .filter((c) => !c.id)
          .map((c) => ({
            name: c.name,
            email: c.email,
            phone_number: c.phone_number,
          })),
        update: contacts
          .filter((c) => !!c.id)
          .map((c) => ({
            where: { id: c.id as string },
            data: {
              name: c.name,
              email: c.email,
              phone_number: c.phone_number,
            },
          })),
      };
    }

    if (partner_bank_accounts) {
      const idsToKeep = partner_bank_accounts
        .map((b) => b.id)
        .filter((bid): bid is string => !!bid);
      payload.partner_bank_accounts = {
        deleteMany: {
          id: { notIn: idsToKeep },
        },
        create: partner_bank_accounts
          .filter((b) => !b.id)
          .map((b) => ({
            bank_id: b.bank_id,
            account_number: b.account_number,
            account_name: b.account_name,
          })),
        update: partner_bank_accounts
          .filter((b) => !!b.id)
          .map((b) => ({
            where: { id: b.id as string },
            data: {
              bank_id: b.bank_id,
              account_number: b.account_number,
              account_name: b.account_name,
            },
          })),
      };
    }

    const result = await this.partnerRepository.update(id, payload);
    return PartnerIdSchema.parse(result);
  }

  async findAll(userId: string, query: PartnerQueryDTO) {
    const parsedQuery = PartnerQuerySchema.parse(query);

    const { page, limit, search, types, sortBy, sortOrder } = parsedQuery;
    const skip = (page - 1) * limit;

    const where: Prisma.PartnerWhereInput = {
      user_id: userId,
      deleted_at: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company_email: { contains: search, mode: 'insensitive' } },
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (Array.isArray(types) && types.length > 0) {
      where.types = { hasSome: types as PartnerType[] };
    }

    const [total, data] = await this.partnerRepository.findAll(
      where,
      skip,
      limit,
      sortBy ? { [sortBy]: sortOrder } : undefined,
    );

    return {
      data: PartnerListSchema.parse(data),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getNextNumber(userId: string): Promise<{ number: string }> {
    const latestNumber = await this.partnerRepository.findLatestNumber(userId);
    const nextNumber = incrementDocNumber(latestNumber || '');

    return { number: nextNumber };
  }

  async findByIdAndUserId({ id, userId }: { id: string; userId: string }) {
    const partner = await this.partnerRepository.findById(id);

    if (!partner || partner.user_id !== userId) {
      throw new NotFoundException('Partner not found');
    }

    return PartnerPresentationSchema.parse(partner);
  }

  async delete({ id, userId }: { id: string; userId: string }) {
    await this.findByIdAndUserId({ id, userId });
    return await this.partnerRepository.delete(id);
  }

  async restore(id: string) {
    return await this.partnerRepository.restore(id);
  }
}
