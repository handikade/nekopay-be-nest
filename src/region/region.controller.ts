import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

  /**
   * Get all provinces
   */
  @Get('provinces')
  @ApiResponse({ type: [ProvinceDto] })
  async findAllProvinces() {
    const result: ProvincesResponse = await this.regionService.findAllProvinces();
    return {
      message: 'Provinces retrieved successfully',
      data: result.data,
    };
  }

  /**
   * Get all cities by province ID
   */
  @Get('cities/:provinceId')
  @ApiResponse({ type: [CityDto] })
  async findAllCities(@Param('provinceId') provinceId: string) {
    const result: CitiesResponse = await this.regionService.findAllCities(provinceId);
    return {
      message: 'Cities retrieved successfully',
      data: result.data,
    };
  }

  /**
   * Get all districts by city ID
   */
  @Get('districts/:cityId')
  @ApiResponse({ type: [DistrictDto] })
  async findAllDistricts(@Param('cityId') cityId: string) {
    const result: DistrictsResponse = await this.regionService.findAllDistricts(cityId);
    return {
      message: 'Districts retrieved successfully',
      data: result.data,
    };
  }

  /**
   * Get all villages by district ID
   */
  @Get('villages/:districtId')
  @ApiResponse({ type: [VillageDto] })
  async findAllVillages(@Param('districtId') districtId: string) {
    const result: VillagesResponse = await this.regionService.findAllVillages(districtId);
    return {
      message: 'Villages retrieved successfully',
      data: result.data,
    };
  }
}
