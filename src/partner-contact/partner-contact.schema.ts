import { PartnerContactSchema } from '@src/@generated/zod';
import z from 'zod';

export const PartnerContactPresentationSchema = PartnerContactSchema.omit({
  created_at: true,
  updated_at: true,
});

export const PartnerContactListSchema = z.array(PartnerContactPresentationSchema);
