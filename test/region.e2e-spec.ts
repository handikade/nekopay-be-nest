import { HttpService } from '@nestjs/axios';
import { INestApplication } from '@nestjs/common';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { of } from 'rxjs';
import request from 'supertest';
import { createE2EApp } from './e2e-helper';

describe('RegionController (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} as unknown as AxiosRequestHeaders },
  });

  beforeAll(async () => {
    app = await createE2EApp();
    httpService = app.get<HttpService>(HttpService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/regions/provinces (GET)', () => {
    const mockData = {
      status: true,
      statusCode: 200,
      message: 'success',
      data: [{ id: '1', name: 'Jawa Barat' }],
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse(mockData)));

    return request(app.getHttpServer() as string)
      .get('/regions/provinces')
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body).toEqual({
          statusCode: 200,
          message: 'Provinces retrieved successfully',
          data: [{ id: '1', name: 'Jawa Barat' }],
        });
      });
  });

  it('/regions/cities/:provinceId (GET)', () => {
    const mockData = {
      status: true,
      statusCode: 200,
      message: 'success',
      data: [{ id: '1', provinceId: '1', name: 'Bandung' }],
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse(mockData)));

    return request(app.getHttpServer() as string)
      .get('/regions/cities/1')
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body).toEqual({
          statusCode: 200,
          message: 'Cities retrieved successfully',
          data: [{ id: '1', provinceId: '1', name: 'Bandung' }],
        });
      });
  });
});
