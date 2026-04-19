import { Test, TestingModule } from '@nestjs/testing';
import { Invoice, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { InvoiceRepository } from './invoice.repository';

describe('InvoiceRepository', () => {
  let repository: InvoiceRepository;

  const mockInvoice: Partial<Invoice> = {
    id: 'invoice-id-123',
    number: 'INV-2026-001',
    type: 'SALES',
    document_status: 'DRAFT',
    sent_status: 'NOT_SENT',
    issue_date: new Date('2026-04-19T00:00:00Z'),
    due_date: new Date('2026-05-19T00:00:00Z'),
    currency: 'IDR',
    subtotal: new Prisma.Decimal(100000),
    total_tax: new Prisma.Decimal(11000),
    total_discount: new Prisma.Decimal(0),
    grand_total: new Prisma.Decimal(111000),
    notes: 'Test invoice',
    user_id: 'user-id-123',
    partner_id: 'partner-id-123',
    partner_name: 'Test Partner',
    partner_company_email: 'partner@example.com',
    partner_company_phone: '08123456789',
    partner_address: 'Partner Address',
  };

  const mockPrismaService = {
    invoice: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<InvoiceRepository>(InvoiceRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an invoice', async () => {
      const dto: InvoiceCreatePayloadDto = {
        number: 'INV-2026-001',
        type: 'SALES',
        issue_date: new Date('2026-04-19T00:00:00Z'),
        due_date: new Date('2026-05-19T00:00:00Z'),
        currency: 'IDR',
        subtotal: 100000,
        total_tax: 11000,
        total_discount: 0,
        grand_total: 111000,
        notes: 'Test invoice',
        user_id: 'user-id-123',
        partner_id: 'partner-id-123',
        partner_name: 'Test Partner',
        partner_company_email: 'partner@example.com',
        partner_company_phone: '08123456789',
        partner_address: 'Partner Address',
        items: [
          {
            description: 'Item 1',
            quantity: 1,
            unit_price: 100000,
            discount_rate: 0,
            discount_amount: 0,
            tax_id: 'tax-id-123',
            tax_rate: 0.11,
            tax_type: 'EXCLUSIVE',
            tax_amount: 11000,
            line_total: 111000,
          },
        ],
      };

      const { items, ...invoiceData } = dto;
      mockPrismaService.invoice.create.mockResolvedValue({
        ...mockInvoice,
        items: dto.items,
      });

      const result = await repository.create(dto);

      expect(mockPrismaService.invoice.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.invoice.create).toHaveBeenCalledWith({
        data: {
          ...invoiceData,
          items: {
            create: items,
          },
        },
        include: {
          items: true,
        },
      });
      expect(result).toEqual({
        ...mockInvoice,
        items: dto.items,
      });
    });
  });
});
