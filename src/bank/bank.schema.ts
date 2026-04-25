import { BankScalarFieldEnumSchema, BankSchema, SortOrderSchema } from '@prisma/zod';
import { z } from 'zod';

export const BankPresentationSchema = BankSchema.omit({
  created_at: true,
  updated_at: true,
});

export const BankListSchema = z.array(BankPresentationSchema);

export const BankQueryParamsSchema = z.object({
  page: z.coerce.number().default(1).describe('Page number'),
  limit: z.coerce.number().default(10).describe('Number of items per page'),
  search: z.string().optional().describe('Search keyword'),
  sortBy: BankScalarFieldEnumSchema.optional().default('created_at'),
  sortOrder: SortOrderSchema.optional().default('desc'),
});
