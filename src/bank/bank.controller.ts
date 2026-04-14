import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { FindAllBankDto } from './dto/find-all-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; role: string };
}

@ApiTags('banks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  /**
   * Create a new bank
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Bank successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Admin only)',
  })
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBankDto) {
    return this.bankService.create(req.user, dto);
  }

  /**
   * Get all banks
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Return list of banks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: FindAllBankDto) {
    return this.bankService.findAll(req.user, query);
  }

  /**
   * Get a specific bank by id
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the specific bank' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async findOne(@Param('id') id: string) {
    return this.bankService.findById(id);
  }

  /**
   * Update an existing bank
   */
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateBankDto,
  ) {
    return this.bankService.update(id, req.user, dto);
  }

  /**
   * Delete a bank
   */
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Bank successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.bankService.delete(id, req.user);
  }
}
