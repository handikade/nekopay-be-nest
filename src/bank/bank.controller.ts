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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankService } from './bank.service';
import { BankDto, PaginatedBanksResponseDto } from './dto/bank.dto';
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
  @ApiExcludeEndpoint()
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Bank successfully created',
    type: BankDto,
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
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBankDto): Promise<BankDto> {
    return this.bankService.create(req.user, dto);
  }

  /**
   * Get all banks
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return list of banks',
    type: PaginatedBanksResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: FindAllBankDto,
  ): Promise<PaginatedBanksResponseDto> {
    return this.bankService.findAll(req.user, query);
  }

  /**
   * Get a specific bank by id
   */
  @ApiExcludeEndpoint()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the specific bank', type: BankDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async findOne(@Param('id') id: string): Promise<BankDto> {
    return this.bankService.findById(id);
  }

  /**
   * Update an existing bank
   */
  @ApiExcludeEndpoint()
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank successfully updated',
    type: BankDto,
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
  ): Promise<BankDto> {
    return this.bankService.update(id, req.user, dto);
  }

  /**
   * Delete a bank
   */
  @ApiExcludeEndpoint()
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Bank successfully deleted', type: BankDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<BankDto> {
    return this.bankService.delete(id, req.user);
  }
}
