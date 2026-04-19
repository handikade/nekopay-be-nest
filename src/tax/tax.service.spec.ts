import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Tax } from '@prisma/client';
import { TaxQueryDto } from './dto/tax-query.dto';
import { TaxRepository } from './tax.repository';
import { TaxService } from './tax.service';

describe('TaxService', () => {
  let service: TaxService;

  const mockTax: Tax = {
    id: 'tax-id-123',
    code: 'VAT11',
    name: 'VAT 11%',
    rate: new Prisma.Decimal(0.11),
    type: 'EXCLUSIVE',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockTaxRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxService,
        {
          provide: TaxRepository,
          useValue: mockTaxRepository,
        },
      ],
    }).compile();

    service = module.get<TaxService>(TaxService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated taxes', async () => {
      const query: TaxQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      };

      mockTaxRepository.findAll.mockResolvedValue([1, [mockTax]]);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockTax],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(mockTaxRepository.findAll).toHaveBeenCalledWith({}, 0, 10, { name: 'asc' });
    });

    it('should apply search filter on name only', async () => {
      const query: TaxQueryDto = {
        page: 1,
        limit: 10,
        search: 'VAT',
      };

      mockTaxRepository.findAll.mockResolvedValue([1, [mockTax]]);

      await service.findAll(query);

      expect(mockTaxRepository.findAll).toHaveBeenCalledWith(
        {
          name: { contains: 'VAT', mode: 'insensitive' },
        },
        0,
        10,
        { name: 'asc' },
      );
    });

    it('should throw BadRequestException if query validation fails', async () => {
      const query: unknown = { page: 0 }; // Invalid page

      await expect(service.findAll(query as TaxQueryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return a tax if found', async () => {
      mockTaxRepository.findById.mockResolvedValue(mockTax);

      const result = await service.findById('tax-id-123');

      expect(result).toEqual(mockTax);
    });

    it('should throw NotFoundException if not found', async () => {
      mockTaxRepository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
