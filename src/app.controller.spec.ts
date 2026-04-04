import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('healthCheck', () => {
    it('should return status ok when database is up', async () => {
      const queryRawSpy = jest
        .spyOn(prismaService, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      const result = await appController.healthCheck();

      expect(result).toEqual({
        status: 'ok',
        service: 'up',
        database: 'up',
      });
      expect(queryRawSpy).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when database is down', async () => {
      const queryRawSpy = jest
        .spyOn(prismaService, '$queryRaw')
        .mockRejectedValue(new Error('Connection error'));

      await expect(appController.healthCheck()).rejects.toThrow(InternalServerErrorException);
      expect(queryRawSpy).toHaveBeenCalled();
    });
  });
});
