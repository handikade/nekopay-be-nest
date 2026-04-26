import { PartnerBankAccountSchema } from '@src/@generated/zod';
import { BankPresentationSchema } from '@src/bank/bank.schema';
import z from 'zod';

export const PartnerBankAccountPresentationSchema = PartnerBankAccountSchema.omit({
  created_at: true,
  updated_at: true,
}).extend({
  bank: BankPresentationSchema,
});

export const PartnerBankAccountListSchema = z.array(PartnerBankAccountPresentationSchema);
