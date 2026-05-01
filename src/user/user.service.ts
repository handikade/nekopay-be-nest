import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserCreateDTO, UserQueryParamsDTO } from './user.dto';
import { UserRepository } from './user.repository';
import {
  UserCreateSchema,
  UserListSchema,
  UserPresentationSchema,
  UserQueryParamsSchema,
} from './user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: UserCreateDTO) {
    const validated = UserCreateSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }
    const parsedData = validated.data;

    // Check for existing user with same email or username
    const existingUserByEmail = await this.userRepository.findByEmail(parsedData.email);
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(parsedData.username);
    if (existingUserByUsername) {
      throw new ConflictException('User with this username already exists');
    }

    if (parsedData.phone_number) {
      const existingUserByPhone = await this.userRepository.findByPhoneNumber(
        parsedData.phone_number,
      );
      if (existingUserByPhone) {
        throw new ConflictException('User with this phone number already exists');
      }
    }

    const hashedPassword = await argon2.hash(parsedData.password);

    const user = await this.userRepository.create({
      ...parsedData,
      password: hashedPassword,
    });

    return UserPresentationSchema.parse(user);
  }

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
