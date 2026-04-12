import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CitiesResponse,
  CityDto,
  DistrictDto,
  DistrictsResponse,
  ProvinceDto,
  ProvincesResponse,
  VillageDto,
  VillagesResponse,
} from './dto/region.dto';
import { RegionService } from './region.service';

@ApiTags('Regions')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Get all provinces' })
  @ApiResponse({ type: [ProvinceDto] })
  async findAllProvinces() {
    const result: ProvincesResponse = await this.regionService.findAllProvinces();
    return {
      message: 'Provinces retrieved successfully',
      data: result.data,
    };
  }

  @Get('cities/:provinceId')
  @ApiOperation({ summary: 'Get all cities by province ID' })
  @ApiResponse({ type: [CityDto] })
  async findAllCities(@Param('provinceId') provinceId: string) {
    const result: CitiesResponse = await this.regionService.findAllCities(provinceId);
    return {
      message: 'Cities retrieved successfully',
      data: result.data,
    };
  }

  @Get('districts/:cityId')
  @ApiOperation({ summary: 'Get all districts by city ID' })
  @ApiResponse({ type: [DistrictDto] })
  async findAllDistricts(@Param('cityId') cityId: string) {
    const result: DistrictsResponse = await this.regionService.findAllDistricts(cityId);
    return {
      message: 'Districts retrieved successfully',
      data: result.data,
    };
  }

  @Get('villages/:districtId')
  @ApiOperation({ summary: 'Get all villages by district ID' })
  @ApiResponse({ type: [VillageDto] })
  async findAllVillages(@Param('districtId') districtId: string) {
    const result: VillagesResponse = await this.regionService.findAllVillages(districtId);
    return {
      message: 'Villages retrieved successfully',
      data: result.data,
    };
  }
}
