import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { InvoiceItemCreateSchema } from './invoice-item-create-payload.dto';

export const InvoiceCreateSchema = z.object({
  number: z.string().min(1).max(50).describe('Invoice number'),
  type: z.enum(['SALES', 'PURCHASE']).default('SALES').describe('Invoice type'),
  issue_date: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Invoice issue date'),
  due_date: z.iso
    .datetime()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null))
    .describe('Invoice due date'),
  currency: z.string().max(3).default('IDR').describe('Invoice currency'),
  subtotal: z.number().describe('Invoice subtotal amount'),
  total_tax: z.number().describe('Total tax amount'),
  total_discount: z.number().describe('Total discount amount'),
  grand_total: z.number().describe('Grand total amount'),
  notes: z.string().optional().nullable().describe('Additional notes'),
  user_id: z.uuid().describe('User ID'),
  partner_id: z.uuid().describe('Partner ID'),
  partner_name: z.string().min(1).max(255).optional().describe('Snapshot of partner name'),
  partner_company_email: z
    .string()
    .email()
    .max(255)
    .optional()
    .describe('Snapshot of partner email'),
  partner_company_phone: z.string().min(1).max(20).optional().describe('Snapshot of partner phone'),
  partner_address: z
    .string()
    .max(255)
    .optional()
    .nullable()
    .describe('Snapshot of partner address'),
  items: z.array(InvoiceItemCreateSchema).min(1).describe('List of invoice items'),
});

export class InvoiceCreatePayloadDto extends createZodDto(InvoiceCreateSchema) {}
