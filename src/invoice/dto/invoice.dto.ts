import { z } from 'zod';
import { makeResponseDto, makeResponseSchema } from '../../_core/types/response.type';
import { InvoiceCreateSchema } from './invoice-create-payload.dto';
import { InvoiceItemCreateSchema } from './invoice-item-create-payload.dto';

/**
 * Represents the InvoiceItem model in responses.
 */
export const InvoiceItemResponseSchema = InvoiceItemCreateSchema.extend({
  id: z.string().uuid().describe('Invoice item ID'),
  created_at: z
    .date()
    .transform((val) => val.toISOString())
    .describe('Creation timestamp'),
  updated_at: z
    .date()
    .transform((val) => val.toISOString())
    .describe('Last update timestamp'),
});

/**
 * Represents the Invoice model in responses.
 */
export const InvoiceResponseSchema = InvoiceCreateSchema.extend({
  id: z.string().uuid().describe('Invoice ID'),
  document_status: z
    .enum(['DRAFT', 'POSTED', 'PAID', 'CANCELLED'])
    .describe('Invoice document status'),
  sent_status: z.enum(['SENT', 'NOT_SENT']).describe('Invoice sent status'),
  created_at: z
    .date()
    .transform((val) => val.toISOString())
    .describe('Creation timestamp'),
  updated_at: z
    .date()
    .transform((val) => val.toISOString())
    .describe('Last update timestamp'),
  items: z.array(InvoiceItemResponseSchema).describe('List of invoice items'),
});

/**
 * DTO class for a single invoice response.
 */
export class InvoiceSingleResponseDto extends makeResponseDto(
  makeResponseSchema(InvoiceResponseSchema),
) {}
