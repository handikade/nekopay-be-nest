import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppResponse, createE2EApp } from './e2e-helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const testUser = {
    username: `authuser_${Date.now()}`,
    email: `auth_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    app = await createE2EApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer() as string)
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res: request.Response) => {
        const body = res.body as AppResponse<{ username: string; email: string }>;
        expect(body.data.username).toBe(testUser.username);
        expect(body.data.email).toBe(testUser.email);
        expect(body.data).not.toHaveProperty('password');
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer() as string)
      .post('/auth/login')
      .send({
        identifier: testUser.email,
        password: testUser.password,
      })
      .expect(201)
      .expect((res: request.Response) => {
        const body = res.body as AppResponse<{ accessToken: string }>;
        expect(body.data.accessToken).toBeDefined();
        accessToken = body.data.accessToken;
      });
  });

  it('/auth/profile (GET) - Authenticated', () => {
    return request(app.getHttpServer() as string)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res: request.Response) => {
        const body = res.body as AppResponse<{ username: string }>;
        expect(body.data.username).toBe(testUser.username);
      });
  });

  it('/auth/profile (GET) - Unauthenticated (401)', () => {
    return request(app.getHttpServer() as string)
      .get('/auth/profile')
      .expect(401);
  });
});
