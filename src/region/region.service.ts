import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  CitiesResponse,
  DistrictsResponse,
  ProvincesResponse,
  VillagesResponse,
} from './dto/region.dto';

@Injectable()
export class RegionService {
  private readonly baseUrl = 'https://api-regional-indonesia.vercel.app/api';

  constructor(private readonly httpService: HttpService) {}

  async findAllProvinces(): Promise<ProvincesResponse> {
    const response: AxiosResponse<ProvincesResponse> = await firstValueFrom(
      this.httpService.get<ProvincesResponse>(`${this.baseUrl}/provinces`),
    );
    return response.data;
  }

  async findAllCities(provinceId: string): Promise<CitiesResponse> {
    const response: AxiosResponse<CitiesResponse> = await firstValueFrom(
      this.httpService.get<CitiesResponse>(`${this.baseUrl}/cities/${provinceId}`),
    );
    return response.data;
  }

  async findAllDistricts(cityId: string): Promise<DistrictsResponse> {
    const response: AxiosResponse<DistrictsResponse> = await firstValueFrom(
      this.httpService.get<DistrictsResponse>(`${this.baseUrl}/districts/${cityId}`),
    );
    return response.data;
  }

  async findAllVillages(districtId: string): Promise<VillagesResponse> {
    const response: AxiosResponse<VillagesResponse> = await firstValueFrom(
      this.httpService.get<VillagesResponse>(`${this.baseUrl}/villages/${districtId}`),
    );
    return response.data;
  }
}
