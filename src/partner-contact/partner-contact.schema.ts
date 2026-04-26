import { PartnerContactSchema } from '@src/@generated/zod';
import z from 'zod';

export const PartnerContactCreateSchema = PartnerContactSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const PartnerContactUpdateSchema = PartnerContactCreateSchema.extend({
  id: z.uuid().optional(),
});

export const PartnerContactPresentationSchema = PartnerContactSchema.omit({
  created_at: true,
  updated_at: true,
});

export const PartnerContactListSchema = z.array(PartnerContactPresentationSchema);
