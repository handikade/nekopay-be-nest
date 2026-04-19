import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AllExceptionsFilter } from '../src/_core/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/_core/interceptors/transform.interceptor';
import { AppModule } from '../src/app.module';

export interface AppResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
}

export async function createE2EApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.init();
  return app;
}

export async function getAuthToken(
  app: INestApplication,
): Promise<{ token: string; user: Record<string, string> }> {
  const timestamp = Date.now();
  const testUser = {
    username: `user_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    password: 'Password123!',
  };

  await request(app.getHttpServer() as string)
    .post('/auth/register')
    .send(testUser);

  const loginRes = await request(app.getHttpServer() as string)
    .post('/auth/login')
    .send({
      identifier: testUser.email,
      password: testUser.password,
    });

  const body = loginRes.body as AppResponse<{ accessToken: string }>;
  return {
    token: body.data.accessToken,
    user: testUser,
  };
}
