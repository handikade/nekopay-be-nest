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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @Post()
  @ApiOperation({ summary: 'Create a new bank' })
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

  @Get()
  @ApiOperation({ summary: 'Get all banks' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['created_at', 'updated_at', 'name', 'code'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Return list of banks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: FindAllBankDto) {
    return this.bankService.findAll(req.user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific bank by id' })
  @ApiResponse({ status: 200, description: 'Return the specific bank' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async findOne(@Param('id') id: string) {
    return this.bankService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing bank' })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bank' })
  @ApiResponse({ status: 200, description: 'Bank successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (Admin only)' })
  @ApiResponse({ status: 404, description: 'Bank not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.bankService.delete(id, req.user);
  }
}
