import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { calculateTaxAmount } from '../_core/utils/calculate-tax.util';
import { PartnerRepository } from '../partner/partner.repository';
import { TaxRepository } from '../tax/tax.repository';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
import { InvoiceItemCreatePayloadDto } from './dto/invoice-item-create-payload.dto';
import { InvoiceUpdatePayloadDto } from './dto/invoice-update-payload.dto';
import { InvoiceRepository } from './invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly partnerRepository: PartnerRepository,
    private readonly taxRepository: TaxRepository,
  ) {}

  async create(data: InvoiceCreatePayloadDto): Promise<Invoice> {
    const partner = await this.partnerRepository.findById(data.partner_id);
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${data.partner_id} not found`);
    }

    if (partner.user_id !== data.user_id) {
      throw new NotFoundException(`Partner with ID ${data.partner_id} not found`);
    }

    const snapshotData = {
      partner_name: partner.name,
      partner_company_email: partner.company_email,
      partner_company_phone: partner.company_phone,
      partner_address: partner.address,
    };

    const calculatedData = await this.calculateInvoiceTotals(data.items);

    return this.invoiceRepository.create({
      ...data,
      ...snapshotData,
      ...calculatedData,
    });
  }

  async findById(id: string, userId: string) {
    const invoice = await this.invoiceRepository.findById(id);

    if (!invoice || invoice.user_id !== userId) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async update(id: string, user_id: string, data: InvoiceUpdatePayloadDto): Promise<Invoice> {
    const existingInvoice = await this.findById(id, user_id);

    if (existingInvoice.document_status !== 'DRAFT') {
      throw new BadRequestException(`Only DRAFT invoices can be updated`);
    }

    let snapshotData = {};
    if (data.partner_id) {
      const partner = await this.partnerRepository.findById(data.partner_id);
      if (!partner || partner.user_id !== user_id) {
        throw new NotFoundException(`Partner with ID ${data.partner_id} not found`);
      }

      snapshotData = {
        partner_name: partner.name,
        partner_company_email: partner.company_email,
        partner_company_phone: partner.company_phone,
        partner_address: partner.address,
      };
    }

    let calculatedData = {};
    if (data.items) {
      calculatedData = await this.calculateInvoiceTotals(data.items);
    }

    return this.invoiceRepository.update(id, {
      ...data,
      ...snapshotData,
      ...calculatedData,
    });
  }

  async remove(id: string, user_id: string): Promise<Invoice> {
    const invoice = await this.findById(id, user_id);

    if (invoice.document_status !== 'DRAFT') {
      throw new BadRequestException('Only DRAFT invoices can be deleted');
    }

    return this.invoiceRepository.softDelete(id);
  }

  async cancel(id: string, user_id: string): Promise<Invoice> {
    const invoice = await this.findById(id, user_id);

    if (invoice.document_status === 'DRAFT') {
      throw new BadRequestException('DRAFT invoices cannot be cancelled, use delete instead');
    }

    if (invoice.document_status === 'CANCELLED') {
      throw new BadRequestException('Invoice is already cancelled');
    }

    return this.invoiceRepository.updateStatus(id, 'CANCELLED');
  }

  private async calculateInvoiceTotals(items: InvoiceItemCreatePayloadDto[]) {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const calculatedItems = await Promise.all(
      items.map(async (item) => {
        const itemSubtotal = item.quantity * item.unit_price;
        subtotal += itemSubtotal;

        let discountAmount = 0;
        if (item.discount_type === 'PERCENTAGE') {
          discountAmount = itemSubtotal * ((item.discount_rate || 0) / 100);
        } else {
          discountAmount = item.discount_amount || 0;
        }
        totalDiscount += discountAmount;

        const baseAmount = itemSubtotal - discountAmount;

        let taxRate = item.tax_rate || 0;
        let taxType: 'INCLUSIVE' | 'EXCLUSIVE' = item.tax_type || 'EXCLUSIVE';

        if (item.tax_id) {
          const tax = await this.taxRepository.findById(item.tax_id);
          if (tax) {
            taxRate = Number(tax.rate);
            taxType = tax.type as 'INCLUSIVE' | 'EXCLUSIVE';
          }
        }

        const taxAmount = calculateTaxAmount({
          rate: taxRate,
          isExclusive: taxType === 'EXCLUSIVE',
          baseAmount,
        });
        totalTax += taxAmount;

        const lineTotal = taxType === 'EXCLUSIVE' ? baseAmount + taxAmount : baseAmount;

        return {
          ...item,
          discount_amount: discountAmount,
          tax_rate: taxRate,
          tax_type: taxType,
          tax_amount: taxAmount,
          line_total: lineTotal,
        };
      }),
    );

    const grandTotal =
      subtotal -
      totalDiscount +
      calculatedItems.reduce((acc, item) => {
        return item.tax_type === 'EXCLUSIVE' ? acc + (item.tax_amount || 0) : acc;
      }, 0);

    return {
      items: calculatedItems,
      subtotal,
      total_tax: totalTax,
      total_discount: totalDiscount,
      grand_total: grandTotal,
    };
  }
}
