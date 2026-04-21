import { Test, TestingModule } from '@nestjs/testing';
import { PartnerRepository } from './partner.repository';
import { PartnerService } from './partner.service';

type MockPartnerRepository = {
  findLatestNumber: jest.Mock;
  create: jest.Mock;
  findById: jest.Mock;
  findAll: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  restore: jest.Mock;
};

describe('PartnerService', () => {
  let service: PartnerService;

  const mockPartnerRepository: MockPartnerRepository = {
    findLatestNumber: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerService, { provide: PartnerRepository, useValue: mockPartnerRepository }],
    }).compile();

    service = module.get<PartnerService>(PartnerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNextNumber', () => {
    it('should return incremented number if latest number exists', async () => {
      mockPartnerRepository.findLatestNumber.mockResolvedValue('PRT-001');

      const result = await service.getNextNumber('user-id-123');

      expect(mockPartnerRepository.findLatestNumber).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual({ number: 'PRT-002' });
    });

    it('should return 001 if no latest number exists', async () => {
      mockPartnerRepository.findLatestNumber.mockResolvedValue(null);

      const result = await service.getNextNumber('user-id-123');

      expect(result).toEqual({ number: '001' });
    });

    it('should correctly increment numeric sequence at the end', async () => {
      mockPartnerRepository.findLatestNumber.mockResolvedValue('PARTNER-99');

      const result = await service.getNextNumber('user-id-123');

      expect(result).toEqual({ number: 'PARTNER-100' });
    });
  });
});
