import { z } from 'zod';
import { makeResponseDto, makeResponseSchema } from '../../_core/types/response.type';

/**
 * Schema for the next invoice number data.
 */
export const InvoiceNextNumberSchema = z.object({
  next_number: z.string().describe('The next available invoice number'),
});

/**
 * DTO class for the next invoice number response.
 */
export class InvoiceNextNumberResponseDto extends makeResponseDto(
  makeResponseSchema(InvoiceNextNumberSchema),
) {}
