import { z } from 'zod';

export const PartnerBankSchema = z.object({
  id: z.uuid().describe('Bank ID'),
  code: z.string().describe('Bank code'),
  name: z.string().describe('Bank name'),
});

export const PartnerBankAccountSchema = z.object({
  id: z.uuid().describe('Bank account ID'),
  bank_id: z.uuid().describe('Bank ID'),
  account_number: z.string().describe('Bank account number'),
  account_name: z.string().describe('Account holder name'),
  created_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
  bank: PartnerBankSchema.describe('Associated bank details'),
});
