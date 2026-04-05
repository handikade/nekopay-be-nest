import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            checkHealth: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should call healthService.checkHealth()', async () => {
      const expectedResult = {
        status: 'ok',
        service: 'up',
        database: 'up',
      };
      const checkHealthSpy = jest.spyOn(service, 'checkHealth').mockResolvedValue(expectedResult);

      const result = await controller.healthCheck();

      expect(result).toBe(expectedResult);
      expect(checkHealthSpy).toHaveBeenCalled();
    });
  });
});
