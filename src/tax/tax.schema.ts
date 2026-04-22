import { TaxType } from '@prisma/client';
import { z } from 'zod';

export const TaxSchema = z.object({
  id: z.uuid().describe('Tax ID'),
  code: z.string().describe('Tax code'),
  rate: z.coerce.number().describe('Tax rate'),
  type: z.enum(TaxType).describe('Tax type'),
  name: z.string().describe('Tax name'),
  created_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
});

export const TaxArraySchema = z.array(TaxSchema);

export const TaxQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'code', 'rate', 'created_at', 'updated_at']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// #region USER_FACING SCHEMAS
export const TaxResponseSchema = TaxSchema.extend({
  id: z.string().describe('UUID as string'),
  created_at: z.string().describe('Creation timestamp as string'),
  updated_at: z.string().describe('Last update timestamp as string'),
});
export const TaxArrayResponseSchema = z.array(TaxResponseSchema);
// #endregion USER_FACING SCHEMAS
