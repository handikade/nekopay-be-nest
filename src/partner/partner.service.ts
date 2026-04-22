import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { incrementDocNumber } from '../_core/utils/increment-doc-number.util';
import { PartnerCreatePayloadDto, PartnerQueryDto, PartnerUpdatePayloadDto } from './partner.dto';
import { PartnerRepository } from './partner.repository';
import {
  InternalCreatePartnerSchema,
  PartnerQuerySchema,
  UpdatePartnerSchema,
} from './partner.schema';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async getNextNumber(userId: string): Promise<{ number: string }> {
    const latestNumber = await this.partnerRepository.findLatestNumber(userId);
    const nextNumber = incrementDocNumber(latestNumber || '');
    return { number: nextNumber };
  }

  async create(userId: string, dto: PartnerCreatePayloadDto) {
    const payload = { ...dto, user_id: userId };
    const validated = InternalCreatePartnerSchema.safeParse(payload);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.partnerRepository.create(validated.data);
  }

  async findById(id: string, user: UserPayload, includeDeleted: boolean = false) {
    const isAdmin = user.role === 'admin';
    const partner = await this.partnerRepository.findById(id, isAdmin, includeDeleted);

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    if (!isAdmin && partner.user_id !== user.id) {
      throw new ForbiddenException('You do not have permission to access this partner');
    }

    return partner;
  }

  async findAll(user: UserPayload, query: PartnerQueryDto) {
    const validated = PartnerQuerySchema.safeParse(query);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }
    const { page, limit, search, type, sortBy, sortOrder } = validated.data;
    const skip = (page - 1) * limit;

    const where: Prisma.PartnerWhereInput = {};
    if (user.role !== 'admin') {
      where.user_id = user.id;
    }

    if (type && type.length > 0) {
      where.types = { hasEvery: type };
    }

    if (search) {
      const orConditions: Prisma.PartnerWhereInput[] = [
        { name: { contains: search, mode: 'insensitive' } },
        { company_email: { contains: search, mode: 'insensitive' } },
      ];

      where.OR = orConditions;
    }

    const orderBy: Prisma.PartnerOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const isAdmin = user.role === 'admin';
    const [total, data] = await this.partnerRepository.findAll(
      where,
      skip,
      limit,
      orderBy,
      isAdmin,
    );

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

  async update(id: string, user: UserPayload, dto: PartnerUpdatePayloadDto) {
    await this.findById(id, user);

    const validated = UpdatePartnerSchema.safeParse(dto);

    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.partnerRepository.update(id, validated.data as PartnerUpdatePayloadDto);
  }

  async delete(id: string, user: UserPayload) {
    await this.findById(id, user);
    await this.partnerRepository.delete(id);
  }

  async restore(id: string, user: UserPayload) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can restore a partner');
    }

    await this.findById(id, user, true);

    return this.partnerRepository.restore(id);
  }
}
