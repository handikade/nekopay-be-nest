import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppResponse, createE2EApp, getAuthToken } from './e2e-helper';

describe('TaxController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    app = await createE2EApp();
    const auth = await getAuthToken(app);
    accessToken = auth.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/taxes (GET) - Authenticated', () => {
    return request(app.getHttpServer() as string)
      .get('/taxes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res: request.Response) => {
        const body = res.body as AppResponse<unknown[]>;
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.meta).toBeDefined();
        if (body.meta) {
          expect(body.meta.total).toBeDefined();
        }
      });
  });

  it('/taxes (GET) - Unauthenticated (401)', () => {
    return request(app.getHttpServer() as string)
      .get('/taxes')
      .expect(401);
  });

  it('/taxes/:id (GET) - Not Found', () => {
    const nonexistentId = '00000000-0000-0000-0000-000000000000';
    return request(app.getHttpServer() as string)
      .get(`/taxes/${nonexistentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
