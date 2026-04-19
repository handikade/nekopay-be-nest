import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Tax } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TaxRepository } from './tax.repository';

describe('TaxRepository', () => {
  let repository: TaxRepository;

  const mockTax: Tax = {
    id: 'tax-id-123',
    code: 'VAT11',
    name: 'VAT 11%',
    rate: new Prisma.Decimal(0.11),
    type: 'EXCLUSIVE',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPrismaService = {
    tax: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<TaxRepository>(TaxRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of taxes and total count', async () => {
      mockPrismaService.tax.count.mockResolvedValue(1);
      mockPrismaService.tax.findMany.mockResolvedValue([mockTax]);

      const [total, data] = await repository.findAll({}, 0, 10, { name: 'asc' });

      expect(total).toBe(1);
      expect(data).toEqual([mockTax]);
      expect(mockPrismaService.tax.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.tax.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a tax if found', async () => {
      mockPrismaService.tax.findUnique.mockResolvedValue(mockTax);

      const result = await repository.findById('tax-id-123');

      expect(result).toEqual(mockTax);
      expect(mockPrismaService.tax.findUnique).toHaveBeenCalledWith({
        where: { id: 'tax-id-123' },
      });
    });

    it('should return null if not found', async () => {
      mockPrismaService.tax.findUnique.mockResolvedValue(null);

      const result = await repository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
