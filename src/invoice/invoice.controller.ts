import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  ErrorResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedResponseDto,
} from '../_core/types/error-response.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { InvoiceCreateResponseDto } from './dto/invoice-create-response.dto';
import { InvoiceUpdatePayloadDto } from './dto/invoice-update-payload.dto';
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
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async create(@Req() req: AuthenticatedRequest, @Body() dto: InvoiceCreatePayloadDto) {
    // Inject user_id from the authenticated request to ensure ownership
    dto.user_id = req.user.id;
    return this.invoiceService.create(dto);
  }

  /**
   * Update an existing invoice
   */
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Invoice successfully updated',
    type: InvoiceCreateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error or not DRAFT)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Invoice not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: InvoiceUpdatePayloadDto,
  ) {
    return this.invoiceService.update(id, req.user.id, dto);
  }
}
