import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: RegisterDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }
}
