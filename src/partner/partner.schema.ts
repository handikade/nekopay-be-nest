import { PartnerType } from '@prisma/client';
import { PartnerSchema, SortOrderSchema } from '@prisma/zod';
import { z } from 'zod';

export const PartnerQuerySchema = z.object({
  page: z.coerce.number().default(1).describe('Page number'),
  limit: z.coerce.number().default(10).describe('Number of items per page'),
  search: z.string().optional().describe('Search keyword'),
  types: z
    .preprocess(
      (val) => {
        if (typeof val === 'string') return [val];
        return val;
      },
      z.array(z.nativeEnum(PartnerType)),
    )
    .optional()
    .describe('Filter by partner types'),
  sortBy: z.enum(['name', 'company_email', 'created_at']).optional().default('created_at'),
  sortOrder: SortOrderSchema.optional().default('desc'),
});

export const PartnerPresentationSchema = PartnerSchema.omit({
  updated_at: true,
  created_at: true,
  deleted_at: true,
}).extend({
  created_at: z
    .preprocess((val) => (val instanceof Date ? val.toISOString() : val), z.iso.datetime())
    .describe('Creation timestamp'),
});

export const PartnerListSchema = z.array(
  PartnerPresentationSchema.pick({
    id: true,
    company_email: true,
    company_phone: true,
    name: true,
    number: true,
    types: true,
    created_at: true,
  }),
);

export const PartnerIdSchema = PartnerSchema.pick({ id: true });

export const PartnerNumberSchema = PartnerSchema.pick({ number: true });
