import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiAuthErrors,
  ApiResourceErrors,
  ApiValidationErrors,
} from '../_core/decorators/swagger-response.decorator';
import { type AuthenticatedRequest } from '../_core/types/response-authenticated.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PartnerCreatePayloadDto,
  PartnerQueryDto,
  PartnerUpdatePayloadDto,
  ResponseSuccessPartnerIdOnlyDto,
  ResponseSuccessPartnerListDto,
  ResponseSuccessPartnerNextNumberDto,
  ResponseSuccessPartnerSingleDto,
} from './partner.dto';
import { PartnerService } from './partner.service';

@ApiTags('partners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiAuthErrors()
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  /**
   * Get next partner number
   */
  @Get('next-number')
  @ApiResponse({
    status: 200,
    description: 'Return the next partner number',
    type: ResponseSuccessPartnerNextNumberDto,
  })
  async getNextNumber(@Req() req: AuthenticatedRequest) {
    return await this.partnerService.getNextNumber(req.user.id);
  }

  /**
   * Create a new partner
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Partner successfully created',
    type: ResponseSuccessPartnerIdOnlyDto,
  })
  @ApiValidationErrors()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: PartnerCreatePayloadDto) {
    const result = await this.partnerService.create(req.user.id, dto);
    return { id: result.id };
  }

  /**
   * Get all partners
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return list of partners',
    type: ResponseSuccessPartnerListDto,
  })
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: PartnerQueryDto) {
    return this.partnerService.findAll(req.user, query);
  }

  /**
   * Get a specific partner by id
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return the specific partner',
    type: ResponseSuccessPartnerSingleDto,
  })
  @ApiResourceErrors('Partner')
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
    type: ResponseSuccessPartnerIdOnlyDto,
  })
  @ApiValidationErrors()
  @ApiResourceErrors('Partner')
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: PartnerUpdatePayloadDto,
  ) {
    return this.partnerService.update(id, req.user, dto);
  }

  /**
   * Delete a partner
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
  @ApiResponse({
    status: 203,
    description: 'Partner successfully deleted',
  })
  @ApiResourceErrors('Partner')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.partnerService.delete(id, req.user);
  }

  /**
   * Restore a deleted partner (Admin only)
   */
  @ApiExcludeEndpoint()
  @Patch(':id/restore')
  @ApiResponse({
    status: 200,
    description: 'Partner successfully restored',
    type: ResponseSuccessPartnerIdOnlyDto,
  })
  @ApiResourceErrors('Partner')
  async restore(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.partnerService.restore(id, req.user);
  }
}
