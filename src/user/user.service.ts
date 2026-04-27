import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserQueryParamsDTO } from './user.dto';
import { UserRepository } from './user.repository';
import { UserListSchema, UserPresentationSchema, UserQueryParamsSchema } from './user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(query: UserQueryParamsDTO) {
    const parsedQuery = UserQueryParamsSchema.parse(query);
    const { page, limit, search, sortBy, sortOrder } = parsedQuery;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone_number: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await this.userRepository.findAll(
      where,
      skip,
      limit,
      sortBy ? { [sortBy]: sortOrder } : undefined,
    );

    return {
      data: UserListSchema.parse(data),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserPresentationSchema.parse(user);
  }
}
