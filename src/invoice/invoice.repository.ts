import { Injectable } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: InvoiceCreatePayloadDto): Promise<Invoice> {
    const { items, ...invoiceData } = data;

    return this.prisma.invoice.create({
      data: {
        ...invoiceData,
        partner_name: invoiceData.partner_name!,
        partner_company_email: invoiceData.partner_company_email!,
        partner_company_phone: invoiceData.partner_company_phone!,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });
  }
}
