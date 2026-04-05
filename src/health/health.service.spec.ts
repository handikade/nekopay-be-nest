import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkHealth', () => {
    it('should return status ok when database is up', async () => {
      const queryRawSpy = jest.spyOn(prisma, '$queryRaw').mockResolvedValue([{ 1: 1 }]);

      const result = await service.checkHealth();

      expect(result).toEqual({
        status: 'ok',
        service: 'up',
        database: 'up',
      });
      expect(queryRawSpy).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when database is down', async () => {
      const errorMsg = 'Connection error';
      const queryRawSpy = jest.spyOn(prisma, '$queryRaw').mockRejectedValue(new Error(errorMsg));

      try {
        await service.checkHealth();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        const response = (error as InternalServerErrorException).getResponse() as {
          status: string;
          service: string;
          database: string;
          error: string;
        };
        expect(response).toEqual({
          status: 'error',
          service: 'up',
          database: 'down',
          error: errorMsg,
        });
      }
      expect(queryRawSpy).toHaveBeenCalled();
    });
  });
});
