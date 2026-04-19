/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppResponse, createE2EApp, getAuthToken } from './e2e-helper';

interface Partner {
  id: string;
  name: string;
  types: string[];
}

interface CreatePartnerResponse {
  id: string;
}

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
        const body = (res as any).body as AppResponse<Partner[]>;
        expect(Array.isArray(body.data)).toBe(true);
      });
  });

  it('/partners (GET) - Filter by type', async () => {
    // Create a partner with SUPPLIER type first
    const timestamp = Date.now();
    await request(app.getHttpServer() as string)
      .post('/partners')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: `Supplier Corp ${timestamp}`,
        types: ['SUPPLIER'],
        legal_entity: 'PT',
        company_email: `supplier_${timestamp}@test.com`,
        company_phone: '0812345678',
      })
      .expect(201)
      .expect((res: request.Response) => {
        const body = (res as any).body as AppResponse<CreatePartnerResponse>;
        expect(body.data).toEqual({
          id: expect.any(String),
        });
      });

    await request(app.getHttpServer() as string)
      .post('/partners')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: `Buyer Corp ${timestamp}`,
        types: ['BUYER'],
        legal_entity: 'PT',
        company_email: `buyer_${timestamp}@test.com`,
        company_phone: '0812345679',
      })
      .expect(201)
      .expect((res: request.Response) => {
        const body = (res as any).body as AppResponse<CreatePartnerResponse>;
        expect(body.data).toEqual({
          id: expect.any(String),
        });
      });

    const res = await request(app.getHttpServer() as string)
      .get('/partners?type=SUPPLIER')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = (res as any).body as AppResponse<Partner[]>;
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    body.data.forEach((p) => {
      expect(p.types).toContain('SUPPLIER');
    });
  });

  it('/partners (GET) - Filter by multiple types (Intersection)', async () => {
    // Create a partner with BOTH types
    const timestamp = Date.now();
    await request(app.getHttpServer() as string)
      .post('/partners')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: `Both Corp ${timestamp}`,
        types: ['SUPPLIER', 'BUYER'],
        legal_entity: 'PT',
        company_email: `both_${timestamp}@test.com`,
        company_phone: '0812345680',
      })
      .expect(201)
      .expect((res: request.Response) => {
        const body = (res as any).body as AppResponse<CreatePartnerResponse>;
        expect(body.data).toEqual({
          id: expect.any(String),
        });
      });

    const res = await request(app.getHttpServer() as string)
      .get('/partners?type=SUPPLIER&type=BUYER')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = (res as any).body as AppResponse<Partner[]>;
    // Should return at least 1, and each should have BOTH types
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    body.data.forEach((p) => {
      expect(p.types).toContain('SUPPLIER');
      expect(p.types).toContain('BUYER');
    });
  });

  it('/partners (GET) - Unauthenticated (401)', () => {
    return request(app.getHttpServer() as string)
      .get('/partners')
      .expect(401);
  });
});
