import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        service: 'up',
        database: 'up',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'error',
        service: 'up',
        database: 'down',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
