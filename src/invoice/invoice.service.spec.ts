import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Tax } from '@prisma/client';
import { PartnerRepository } from '../partner/partner.repository';
import { TaxRepository } from '../tax/tax.repository';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  const mockInvoiceRepository = {
    create: jest.fn(),
  };

  const mockPartnerRepository = {
    findById: jest.fn(),
  };

  const mockTaxRepository = {
    findById: jest.fn(),
  };

  const mockPartner = {
    id: 'partner-id-123',
    user_id: 'user-id-123',
    name: 'Test Partner',
    company_email: 'partner@example.com',
    company_phone: '08123456789',
    address: 'Partner Address',
  };

  const mockTax = {
    id: 'tax-id-123',
    rate: '0.11',
    type: 'EXCLUSIVE',
  } as unknown as Tax;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: InvoiceRepository, useValue: mockInvoiceRepository },
        { provide: PartnerRepository, useValue: mockPartnerRepository },
        { provide: TaxRepository, useValue: mockTaxRepository },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an invoice with calculated values', async () => {
      const dto: InvoiceCreatePayloadDto = {
        number: 'INV-001',
        type: 'SALES',
        issue_date: new Date(),
        currency: 'IDR',
        subtotal: 0,
        total_tax: 0,
        total_discount: 0,
        grand_total: 0,
        user_id: 'user-id-123',
        partner_id: 'partner-id-123',
        items: [
          {
            description: 'Item 1',
            quantity: 2,
            unit_price: 50000,
            discount_type: 'PERCENTAGE',
            discount_rate: 10,
            tax_id: 'tax-id-123',
            line_total: 0,
          },
        ],
      };

      mockPartnerRepository.findById.mockResolvedValue(mockPartner);
      mockTaxRepository.findById.mockResolvedValue(mockTax);
      mockInvoiceRepository.create.mockImplementation((data: InvoiceCreatePayloadDto) => data);

      const result = (await service.create(dto)) as unknown as InvoiceCreatePayloadDto;

      expect(mockPartnerRepository.findById).toHaveBeenCalledWith('partner-id-123');
      expect(mockTaxRepository.findById).toHaveBeenCalledWith('tax-id-123');
      expect(mockInvoiceRepository.create).toHaveBeenCalled();

      expect(result.subtotal).toBe(100000);
      expect(result.total_discount).toBe(10000);
      expect(result.total_tax).toBe(9900);
      expect(result.grand_total).toBe(99900);
      expect(result.partner_name).toBe(mockPartner.name);
      expect(result.items[0].discount_amount).toBe(10000);
      expect(result.items[0].tax_amount).toBe(9900);
      expect(result.items[0].line_total).toBe(99900);
    });

    it('should handle fixed discounts and inclusive tax', async () => {
      const dto: InvoiceCreatePayloadDto = {
        number: 'INV-002',
        issue_date: new Date(),
        user_id: 'user-id-123',
        partner_id: 'partner-id-123',
        subtotal: 0,
        total_tax: 0,
        total_discount: 0,
        grand_total: 0,
        items: [
          {
            description: 'Item 2',
            quantity: 1,
            unit_price: 100000,
            discount_type: 'FIXED',
            discount_amount: 20000,
            tax_id: 'tax-id-inclusive',
            line_total: 0,
          },
        ],
      };

      mockPartnerRepository.findById.mockResolvedValue(mockPartner);
      mockTaxRepository.findById.mockResolvedValue({
        id: 'tax-id-inclusive',
        rate: '0.11',
        type: 'INCLUSIVE',
      } as unknown as Tax);
      mockInvoiceRepository.create.mockImplementation((data: InvoiceCreatePayloadDto) => data);

      const result = (await service.create(dto)) as unknown as InvoiceCreatePayloadDto;

      expect(result.subtotal).toBe(100000);
      expect(result.total_discount).toBe(20000);
      expect(result.total_tax).toBe(7927.93);
      expect(result.grand_total).toBe(80000);
    });

    it('should throw NotFoundException if partner not found', async () => {
      mockPartnerRepository.findById.mockResolvedValue(null);
      const dto = { partner_id: 'invalid-id' } as unknown as InvoiceCreatePayloadDto;

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });
});
