import { Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { calculateTaxAmount } from '../_core/utils/calculate-tax.util';
import { PartnerRepository } from '../partner/partner.repository';
import { TaxRepository } from '../tax/tax.repository';
import { InvoiceCreatePayloadDto } from './dto/invoice-create-payload.dto';
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

    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const calculatedItems = await Promise.all(
      data.items.map(async (item) => {
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
        let taxType = item.tax_type || 'EXCLUSIVE';

        if (item.tax_id) {
          const tax = await this.taxRepository.findById(item.tax_id);
          if (tax) {
            taxRate = Number(tax.rate);
            taxType = tax.type;
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

    // Re-calculating grand total correctly based on inclusive/exclusive logic
    // Actually, subtotal is sum of unit_price * quantity.
    // grandTotal = subtotal - totalDiscount + (sum of exclusive taxes)
    // If tax is inclusive, it's already in the baseAmount (which is part of subtotal).

    return this.invoiceRepository.create({
      ...data,
      ...snapshotData,
      subtotal,
      total_tax: totalTax,
      total_discount: totalDiscount,
      grand_total: grandTotal,
      items: calculatedItems,
    });
  }
}
