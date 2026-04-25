import { ApiErrors401, ApiErrors404, ApiErrors500 } from '@libs/swagger';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaxListResponseDTO, TaxQueryParamsDTO, TaxResponseDTO } from './tax.dto';
import { TaxService } from './tax.service';

@ApiTags('taxes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiErrors401()
@ApiErrors500()
@Controller('taxes')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return list of taxes',
    type: TaxListResponseDTO,
  })
  async findAll(@Query() query: TaxQueryParamsDTO) {
    return await this.taxService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return the specific tax',
    type: TaxResponseDTO,
  })
  @ApiErrors404('Tax')
  async findOne(@Param('id') id: string) {
    return await this.taxService.findById(id);
  }
}
