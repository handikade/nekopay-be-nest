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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { FindAllPartnerDto } from './dto/find-all-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerService } from './partner.service';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; role: string };
}

@ApiTags('partners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  /**
   * Create a new partner
   */
  @Post()
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

  /**
   * Get all partners (optimized field selection)
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Return list of partners' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: FindAllPartnerDto) {
    return this.partnerService.findAll(req.user, query);
  }

  /**
   * Get a specific partner by id
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return the specific partner' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.partnerService.findById(id, req.user);
  }

  /**
   * Update an existing partner
   */
  @Patch(':id')
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

  /**
   * Delete a partner
   */
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Partner successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.partnerService.delete(id, req.user);
  }

  /**
   * Restore a deleted partner (Admin only)
   */
  @ApiExcludeEndpoint()
  @Patch(':id/restore')
  @ApiResponse({ status: 200, description: 'Partner successfully restored' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden (Only admin can restore or partner not belong to user)',
  })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async restore(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.partnerService.restore(id, req.user);
  }
}
