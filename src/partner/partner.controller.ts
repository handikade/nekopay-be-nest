import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  PartnerCreateDTO,
  PartnerQueryDTO,
  PartnerUpdateDTO,
  ResponseSuccessPartnerCreateDto,
  ResponseSuccessPartnerListDto,
  ResponseSuccessPartnerNextNumberDto,
  ResponseSuccessPartnerUpdateDto,
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
   * Create Partner
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Partner successfully created',
    type: ResponseSuccessPartnerCreateDto,
  })
  @ApiValidationErrors()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: PartnerCreateDTO) {
    return await this.partnerService.create(req.user.id, dto);
  }

  /**
   * Update Partner
   */
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Partner successfully updated',
    type: ResponseSuccessPartnerUpdateDto,
  })
  @ApiValidationErrors()
  @ApiResourceErrors('Partner')
  async update(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: PartnerUpdateDTO,
  ) {
    return await this.partnerService.update(id, req.user.id, dto);
  }

  /**
   * Find All
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return list of partners',
    type: ResponseSuccessPartnerListDto,
  })
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: PartnerQueryDTO) {
    return this.partnerService.findAll(req.user.id, query);
  }

  /**
   * Get Next Number
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
   * Soft Delete
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NON_AUTHORITATIVE_INFORMATION)
  @ApiResponse({
    status: 203,
    description: 'Partner successfully deleted',
  })
  @ApiResourceErrors('Partner')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.partnerService.delete({
      id,
      userId: req.user.id,
    });
  }

  @ApiExcludeEndpoint()
  @Patch(':id/restore')
  async restore(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can restore partners');
    }
    return this.partnerService.restore(id);
  }
}
