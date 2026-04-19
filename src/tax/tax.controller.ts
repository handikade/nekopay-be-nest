import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  InternalServerErrorResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '../_core/types/error-response.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaxQueryDto } from './dto/tax-query.dto';
import { TaxListResponseDto, TaxSingleResponseDto } from './dto/tax.dto';
import { TaxService } from './tax.service';

@ApiTags('taxes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  /**
   * Get all taxes
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return list of taxes',
    type: TaxListResponseDto,
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
  async findAll(@Query() query: TaxQueryDto): Promise<TaxListResponseDto> {
    return (await this.taxService.findAll(query)) as unknown as TaxListResponseDto;
  }

  /**
   * Get a specific tax by id
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return the specific tax',
    type: TaxSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tax not found',
    type: NotFoundResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<TaxSingleResponseDto> {
    return (await this.taxService.findById(id)) as unknown as TaxSingleResponseDto;
  }
}
