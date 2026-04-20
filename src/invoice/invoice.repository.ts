import { Injectable } from '@nestjs/common';
import { Invoice, InvoiceItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';

interface InvoiceUpdateData extends Omit<Prisma.InvoiceUpdateInput, 'items'> {
  items?: Prisma.InvoiceItemCreateManyInvoiceInput[];
}

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

  async findById(id: string): Promise<(Invoice & { items: InvoiceItem[] }) | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async update(id: string, data: InvoiceUpdateData): Promise<Invoice> {
    const { items, ...invoiceData } = data;

    return this.prisma.$transaction(async (tx) => {
      // If items are provided, delete existing ones and create new ones
      if (items) {
        await tx.invoiceItem.deleteMany({
          where: { invoice_id: id },
        });
      }

      return tx.invoice.update({
        where: { id },
        data: {
          ...invoiceData,
          items: items ? { create: items } : undefined,
        },
        include: {
          items: true,
        },
      });
    });
  }
}
