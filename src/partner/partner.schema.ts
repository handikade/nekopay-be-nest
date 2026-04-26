import { PartnerType } from '@prisma/client';
import { PartnerSchema, SortOrderSchema } from '@prisma/zod';
import {
  PartnerBankAccountCreateSchema,
  PartnerBankAccountPresentationSchema,
  PartnerBankAccountUpdateSchema,
} from '@src/partner-bank-account/partner-bank-account.schema';
import {
  PartnerContactCreateSchema,
  PartnerContactPresentationSchema,
  PartnerContactUpdateSchema,
} from '@src/partner-contact/partner-contact.schema';
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
      z.array(z.enum(PartnerType)),
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
  contacts: z.array(PartnerContactPresentationSchema).optional(),
  partner_bank_accounts: z.array(PartnerBankAccountPresentationSchema).optional(),
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

export const PartnerCreateSchema = PartnerSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  user_id: true,
}).extend({
  number: z.string().optional(),
  contacts: z.array(PartnerContactCreateSchema).optional(),
  partner_bank_accounts: z.array(PartnerBankAccountCreateSchema).optional(),
});

export const PartnerUpdateSchema = PartnerCreateSchema.partial().extend({
  contacts: z.array(PartnerContactUpdateSchema).optional(),
  partner_bank_accounts: z.array(PartnerBankAccountUpdateSchema).optional(),
});
