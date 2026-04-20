import { Test, TestingModule } from '@nestjs/testing';
import { Invoice, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { InvoiceRepository } from './invoice.repository';

type MockPrismaService = {
  invoice: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  invoiceItem: {
    deleteMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

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

  const mockPrismaService: MockPrismaService = {
    invoice: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    invoiceItem: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback: (tx: any) => Promise<any>) => callback(mockPrismaService)),
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

  describe('findById', () => {
    it('should find an invoice by id', async () => {
      mockPrismaService.invoice.findUnique.mockResolvedValue(mockInvoice);
      const result = await repository.findById('invoice-id-123');
      expect(mockPrismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 'invoice-id-123' },
        include: { items: true },
      });
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('update', () => {
    it('should successfully update an invoice and its items', async () => {
      const data = {
        number: 'INV-UPDATED',
        items: [{ description: 'New Item', quantity: 1, unit_price: 50000 }],
      };

      mockPrismaService.invoice.update.mockResolvedValue({ ...mockInvoice, ...data });

      const result = await repository.update('invoice-id-123', data);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.invoiceItem.deleteMany).toHaveBeenCalledWith({
        where: { invoice_id: 'invoice-id-123' },
      });
      expect(mockPrismaService.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-id-123' },
        data: {
          number: 'INV-UPDATED',
          items: { create: data.items },
        },
        include: { items: true },
      });
      expect(result.number).toBe('INV-UPDATED');
    });
  });
});
