import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppResponse, createE2EApp, getAuthToken } from './e2e-helper';

interface Partner {
  id: string;
  name: string;
}

interface Tax {
  id: string;
}

interface InvoiceResponse {
  id: string;
  subtotal: string;
  total_discount: string;
  grand_total: string;
}

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let otherAccessToken: string;

  beforeAll(async () => {
    app = await createE2EApp();
    const auth1 = await getAuthToken(app);
    accessToken = auth1.token;

    const auth2 = await getAuthToken(app);
    otherAccessToken = auth2.token;
  });

  afterAll(async () => {
    await app.close();
  });

  async function createPartner(token: string): Promise<Partner> {
    const timestamp = Date.now();
    const res = await request(app.getHttpServer() as string)
      .post('/partners')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Test Partner ${timestamp}`,
        types: ['SUPPLIER'],
        legal_entity: 'PT',
        company_email: `partner_${timestamp}_${Math.random()}@test.com`,
        company_phone: '0812345678',
      })
      .expect(201);
    const body = res.body as AppResponse<Partner>;
    return body.data;
  }

  async function getTaxId(): Promise<string | undefined> {
    const res = await request(app.getHttpServer() as string)
      .get('/taxes')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const body = res.body as AppResponse<Tax[]>;
    return body.data[0]?.id;
  }

  it('/invoices (POST) - Success', async () => {
    const partner = await createPartner(accessToken);
    const taxId = await getTaxId();

    const payload = {
      number: `INV-${Date.now()}`,
      issue_date: new Date().toISOString(),
      partner_id: partner.id,
      items: [
        {
          description: 'Test Item',
          quantity: 2,
          unit_price: 100000,
          discount_type: 'PERCENTAGE',
          discount_rate: 10,
          tax_id: taxId,
        },
      ],
    };

    const res = await request(app.getHttpServer() as string)
      .post('/invoices')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(payload)
      .expect(201);

    const body = res.body as AppResponse<InvoiceResponse>;
    expect(body.data.id).toBeDefined();
    expect(body.data.subtotal).toBe('200000');
    expect(body.data.total_discount).toBe('20000');
    expect(body.data.grand_total).toBeDefined();
  });

  it('/invoices (POST) - Unauthenticated (401)', () => {
    return request(app.getHttpServer() as string)
      .post('/invoices')
      .send({})
      .expect(401);
  });

  it('/invoices (POST) - Partner not owned by user (404)', async () => {
    // Partner created by user 1
    const partner = await createPartner(accessToken);

    const payload = {
      number: `INV-FAIL-${Date.now()}`,
      issue_date: new Date().toISOString(),
      partner_id: partner.id,
      items: [
        {
          description: 'Test Item',
          quantity: 1,
          unit_price: 100000,
        },
      ],
    };

    // User 2 tries to create invoice using User 1's partner
    await request(app.getHttpServer() as string)
      .post('/invoices')
      .set('Authorization', `Bearer ${otherAccessToken}`)
      .send(payload)
      .expect(404);
  });

  describe('/invoices/:id (PATCH)', () => {
    let invoiceId: string;
    let partnerId: string;

    beforeEach(async () => {
      const partner = await createPartner(accessToken);
      partnerId = partner.id;

      const res = await request(app.getHttpServer() as string)
        .post('/invoices')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          number: `INV-UPDATE-${Date.now()}`,
          issue_date: new Date().toISOString(),
          partner_id: partnerId,
          items: [
            {
              description: 'Initial Item',
              quantity: 1,
              unit_price: 100000,
            },
          ],
        });
      invoiceId = (res.body as AppResponse<InvoiceResponse>).data.id;
    });

    it('should update invoice successfully', async () => {
      const updatePayload = {
        number: `INV-UPDATED-${Date.now()}`,
        items: [
          {
            description: 'Updated Item',
            quantity: 3,
            unit_price: 50000,
          },
        ],
      };

      const res = await request(app.getHttpServer() as string)
        .patch(`/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePayload)
        .expect(200);

      const body = res.body as AppResponse<InvoiceResponse>;
      expect(body.data.subtotal).toBe('150000');
    });

    it('should return 404 when updating other user invoice', async () => {
      await request(app.getHttpServer() as string)
        .patch(`/invoices/${invoiceId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`)
        .send({ number: 'NEW-NUMBER' })
        .expect(404);
    });

    it('should return 404 for non-existent invoice', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer() as string)
        .patch(`/invoices/${fakeId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ number: 'NEW-NUMBER' })
        .expect(404);
    });
  });
});
