import { SortOrderSchema, TaxScalarFieldEnumSchema, TaxSchema } from '@prisma/zod';
import { z } from 'zod';

export const TaxPresentationSchema = TaxSchema.omit({
  created_at: true,
  updated_at: true,
}).extend({
  rate: z.coerce.number().describe('Tax rate'),
});

export const TaxListSchema = z.array(TaxPresentationSchema);

export const TaxQueryParamsSchema = z.object({
  page: z.coerce.number().default(1).describe('Page number'),
  limit: z.coerce.number().default(10).describe('Number of items per page'),
  search: z.string().optional().describe('Search keyword'),
  sortBy: TaxScalarFieldEnumSchema.optional().default('name'),
  sortOrder: SortOrderSchema.optional().default('asc'),
});
