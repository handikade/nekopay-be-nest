import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppResponse, createE2EApp } from './e2e-helper';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer() as string)
      .get('/health')
      .expect(200)
      .expect((res: request.Response) => {
        const body = res.body as AppResponse<{ status: string; database: string }>;
        expect(body.data.status).toBe('ok');
        expect(body.data.database).toBe('up');
      });
  });
});
