import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { AuthenticatedRequest, InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;

  const mockInvoiceService = {
    create: jest.fn(),
    getNextNumber: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNextNumber', () => {
    it('should call invoiceService.getNextNumber with user_id from request', async () => {
      const mockReq = {
        user: { id: 'user-id-123', username: 'testuser', role: 'user' },
      } as unknown as AuthenticatedRequest;

      const expectedResponse = { next_number: 'INV-001' };
      mockInvoiceService.getNextNumber.mockResolvedValue(expectedResponse);

      const result = await controller.getNextNumber(mockReq);

      expect(mockInvoiceService.getNextNumber).toHaveBeenCalledTimes(1);
      expect(mockInvoiceService.getNextNumber).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('create', () => {
    it('should call invoiceService.create with user_id from request', async () => {
      const mockReq = {
        user: { id: 'user-id-123', username: 'testuser', role: 'user' },
      } as unknown as AuthenticatedRequest;

      const dto: InvoiceCreatePayloadDto = {
        number: 'INV-001',
        issue_date: new Date(),
        user_id: '', // Will be injected by controller
        partner_id: 'partner-id-123',
        items: [],
        subtotal: 0,
        total_tax: 0,
        total_discount: 0,
        grand_total: 0,
      };

      const expectedResponse = { id: 'invoice-id-123' };
      mockInvoiceService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(mockReq, dto);

      expect(mockInvoiceService.create).toHaveBeenCalledTimes(1);
      expect(dto.user_id).toBe('user-id-123');
      expect(mockInvoiceService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
