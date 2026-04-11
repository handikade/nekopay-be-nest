import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { FindAllPartnerDto } from './dto/find-all-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerService } from './partner.service';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; role: string };
}

@ApiTags('partner')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({
    status: 201,
    description: 'Partner successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePartnerDto) {
    // Overriding / providing user_id from the authenticated user
    return this.partnerService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all partners (optimized field selection)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['created_at', 'updated_at', 'name'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Return list of partners' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: FindAllPartnerDto) {
    return this.partnerService.findAll(req.user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific partner by id' })
  @ApiResponse({ status: 200, description: 'Return the specific partner' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.partnerService.findById(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing partner' })
  @ApiResponse({
    status: 200,
    description: 'Partner successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (validation error)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePartnerDto,
  ) {
    return this.partnerService.update(id, req.user, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a partner' })
  @ApiResponse({ status: 200, description: 'Partner successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.partnerService.delete(id, req.user);
  }
}
