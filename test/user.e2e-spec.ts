import { INestApplication } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { UserPresentationDTO } from '@src/user/user.dto';
import request from 'supertest';
import { AppResponse, createE2EApp, getAuthToken } from './e2e-helper';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createE2EApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer() as string)
        .get('/users')
        .expect(401);
    });

    it('should return 403 if not admin', async () => {
      const { token } = await getAuthToken(app);
      return request(app.getHttpServer() as string)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should return 200 and list of users if admin', async () => {
      const { token, user } = await getAuthToken(app);

      // Promote user to admin
      await prisma.user.update({
        where: { email: user.email },
        data: { role: UserRole.admin },
      });

      return request(app.getHttpServer() as string)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res: request.Response) => {
          const body = res.body as AppResponse<UserPresentationDTO[]>;
          expect(Array.isArray(body.data)).toBe(true);
          expect(body.data.length).toBeGreaterThan(0);
          expect(body.meta).toBeDefined();
          expect(body.meta?.total).toBeDefined();

          // Password should not be present
          // @ts-expect-error password should not exist
          expect(body.data[0].password).toBeUndefined();
        });
    });

    it('should support searching', async () => {
      const { token, user } = await getAuthToken(app);

      // Promote user to admin
      await prisma.user.update({
        where: { email: user.email },
        data: { role: UserRole.admin },
      });

      return request(app.getHttpServer() as string)
        .get('/users')
        .query({ search: user.username })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res: request.Response) => {
          const body = res.body as AppResponse<UserPresentationDTO[]>;
          expect(body.data.length).toBe(1);
          expect(body.data[0].username).toBe(user.username);
        });
    });
  });
});
