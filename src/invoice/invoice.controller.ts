import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { InvoiceCreateResponseDto } from './dto/invoice-create-response.dto';
import { InvoiceService } from './invoice.service';

export interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; role: string };
}

@ApiTags('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  /**
   * Create a new invoice
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Invoice successfully created',
    type: InvoiceCreateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Req() req: AuthenticatedRequest, @Body() dto: InvoiceCreatePayloadDto) {
    // Inject user_id from the authenticated request to ensure ownership
    dto.user_id = req.user.id;
    return this.invoiceService.create(dto);
  }
}
