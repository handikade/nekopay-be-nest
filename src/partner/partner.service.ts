import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PartnerCreateInputSchema } from '@prisma/zod';
import { incrementDocNumber } from '@src/_core/utils/increment-doc-number.util';
import { PartnerQueryDTO } from './partner.dto';
import { PartnerRepository } from './partner.repository';
import { PartnerListSchema, PartnerPresentationSchema, PartnerQuerySchema } from './partner.schema';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async findAll(userId: string, query: PartnerQueryDTO) {
    const parsedQuery = PartnerQuerySchema.parse(query);

    const { page, limit, search, types, sortBy, sortOrder } = parsedQuery;
    const skip = (page - 1) * limit;

    const where: Prisma.PartnerWhereInput = {
      user_id: userId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company_email: { contains: search, mode: 'insensitive' } },
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (types && types.length > 0) {
      where.types = { hasSome: types };
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

  async create(userId: string, dto: unknown) {
    const validated = PartnerCreateInputSchema.safeParse(dto);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.partnerRepository.create({
      ...validated.data,
      user: {
        connect: {
          id: userId,
        },
      },
    });
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
