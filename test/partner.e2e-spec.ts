import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppResponse, createE2EApp, getAuthToken } from './e2e-helper';

describe('PartnerController (e2e)', () => {
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

  it('/partners (GET) - Authenticated', () => {
    return request(app.getHttpServer() as string)
      .get('/partners')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res: request.Response) => {
        const body = res.body as AppResponse<unknown[]>;
        expect(Array.isArray(body.data)).toBe(true);
      });
  });

  it('/partners (GET) - Unauthenticated (401)', () => {
    return request(app.getHttpServer() as string)
      .get('/partners')
      .expect(401);
  });
});
