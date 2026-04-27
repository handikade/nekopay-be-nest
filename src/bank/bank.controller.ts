import { ApiErrors401 } from '@libs/swagger';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '@src/_core/types/authenticated-request.type';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankListResponseDTO, BankQueryParamsDTO } from './bank.dto';
import { BankService } from './bank.service';

@ApiTags('banks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  /**
   * Find All Banks
   */
  @ApiResponse({
    status: 200,
    description: 'Return the bank list',
    type: BankListResponseDTO,
  })
  @ApiErrors401()
  @Get()
  async findAll(@Query() query: BankQueryParamsDTO) {
    return this.bankService.findAll(query);
  }

  @ApiExcludeEndpoint()
  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: unknown) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can create banks');
    }
    return this.bankService.create(dto);
  }

  @ApiExcludeEndpoint()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bankService.findById(id);
  }

  @ApiExcludeEndpoint()
  @Put(':id')
  async update(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() dto: unknown) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can update banks');
    }
    return this.bankService.update(id, dto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can delete banks');
    }
    return this.bankService.delete(id);
  }
}
