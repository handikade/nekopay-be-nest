import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('health')
  async healthCheck() {
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
