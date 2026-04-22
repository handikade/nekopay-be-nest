import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiAuthErrors,
  ApiErrors404,
  ApiErrors500,
} from '../_core/decorators/swagger-response.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaxListResponseDto, TaxQueryDto, TaxResponseDto, TaxSingleResponseDto } from './tax.dto';
import { TaxService } from './tax.service';

@ApiTags('taxes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiAuthErrors()
@ApiErrors500()
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
    type: TaxResponseDto,
  })
  @ApiErrors404('Tax')
  async findOne(@Param('id') id: string): Promise<TaxSingleResponseDto> {
    return (await this.taxService.findById(id)) as unknown as TaxSingleResponseDto;
  }
}
