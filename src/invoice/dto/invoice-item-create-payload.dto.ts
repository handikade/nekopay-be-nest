import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InvoiceItemCreateSchema = z.object({
  description: z.string().min(1).max(255).describe('Item description'),
  quantity: z.number().default(1).describe('Item quantity'),
  unit_price: z.number().describe('Item unit price'),
  discount_rate: z.number().optional().default(0).describe('Discount rate (percentage)'),
  discount_amount: z.number().optional().default(0).describe('Discount amount'),
  tax_id: z.uuid().optional().nullable().describe('Tax ID'),
  tax_rate: z.number().optional().default(0).describe('Tax rate'),
  tax_type: z.enum(['INCLUSIVE', 'EXCLUSIVE']).optional().default('EXCLUSIVE').describe('Tax type'),
  tax_amount: z.number().optional().default(0).describe('Tax amount'),
  line_total: z.number().describe('Line total amount'),
});

export class InvoiceItemCreatePayloadDto extends createZodDto(InvoiceItemCreateSchema) {}
