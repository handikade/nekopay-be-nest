import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { RegionService } from './region.service';

/* eslint-disable @typescript-eslint/unbound-method */

describe('RegionService', () => {
  let service: RegionService;
  let httpService: HttpService;

  const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} as unknown as AxiosRequestHeaders },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegionService>(RegionService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return provinces', async () => {
    const mockData = {
      status: true,
      statusCode: 200,
      message: 'success',
      data: [{ id: '1', name: 'Province 1' }],
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse(mockData)));

    const result = await service.findAllProvinces();
    expect(result).toEqual(mockData);
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('/provinces'));
  });

  it('should return cities', async () => {
    const mockData = {
      status: true,
      statusCode: 200,
      message: 'success',
      data: [{ id: '1', provinceId: '1', name: 'City 1' }],
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse(mockData)));

    const result = await service.findAllCities('1');
    expect(result).toEqual(mockData);
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('/cities/1'));
  });

  it('should return districts', async () => {
    const mockData = {
      status: true,
      statusCode: 200,
      message: 'success',
      data: [{ id: '1', cityId: '1', name: 'District 1' }],
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse(mockData)));

    const result = await service.findAllDistricts('1');
    expect(result).toEqual(mockData);
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('/districts/1'));
  });

  it('should return villages', async () => {
    const mockData = {
      status: true,
      statusCode: 200,
      message: 'success',
      data: [{ id: '1', districtId: '1', name: 'Village 1' }],
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse(mockData)));

    const result = await service.findAllVillages('1');
    expect(result).toEqual(mockData);
    expect(httpService.get).toHaveBeenCalledWith(expect.stringContaining('/villages/1'));
  });
});
