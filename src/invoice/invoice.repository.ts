import { Injectable } from '@nestjs/common';
import { Invoice, InvoiceDocStatus, InvoiceItem, Prisma } from '@prisma/client';
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
    return this.prisma.invoice.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        items: true,
      },
    });
  }

  async findLatestNumber(userId: string): Promise<string | null> {
    const latestInvoice = await this.prisma.invoice.findFirst({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        number: true,
      },
    });

    return latestInvoice?.number || null;
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

  async softDelete(id: string): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data: { deleted_at: new Date() },
      include: {
        items: true,
      },
    });
  }

  async updateStatus(id: string, status: InvoiceDocStatus): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data: { document_status: status },
      include: {
        items: true,
      },
    });
  }
}
