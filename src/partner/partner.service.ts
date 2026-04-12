import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePartnerDto, CreatePartnerSchema } from './dto/create-partner.dto';
import { FindAllPartnerDto, FindAllPartnerSchema } from './dto/find-all-partner.dto';
import { UpdatePartnerDto, UpdatePartnerSchema } from './dto/update-partner.dto';
import { PartnerRepository } from './partner.repository';

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async create(userId: string, dto: CreatePartnerDto) {
    // Inject the logged-in user's ID to prevent manual user_id assignment
    const payload = { ...dto, user_id: userId };

    // Validate the complete payload
    const validated = CreatePartnerSchema.safeParse(payload);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.partnerRepository.create(validated.data as CreatePartnerDto);
  }

  async findById(id: string, user: UserPayload) {
    const isAdmin = user.role === 'admin';
    const partner = await this.partnerRepository.findById(id, isAdmin);

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    // Check ownership for user
    if (!isAdmin && partner.user_id !== user.id) {
      throw new ForbiddenException('You do not have permission to access this partner');
    }

    return partner;
  }

  async findAll(user: UserPayload, query: FindAllPartnerDto) {
    const validated = FindAllPartnerSchema.safeParse(query);
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

    const [total, data] = await this.partnerRepository.findAll(where, skip, limit, orderBy);

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

  async update(id: string, user: UserPayload, dto: UpdatePartnerDto) {
    // Determine if partner exists and if the user has permission to update it
    await this.findById(id, user);

    // Validate the update payload
    const validated = UpdatePartnerSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    return this.partnerRepository.update(id, validated.data as UpdatePartnerDto);
  }

  async delete(id: string, user: UserPayload) {
    // Determine if partner exists and if the user has permission to delete it
    await this.findById(id, user);

    return this.partnerRepository.delete(id);
  }
}
