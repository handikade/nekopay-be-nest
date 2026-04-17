import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreatePartnerContactSchema = z.object({
  name: z.string().min(1).describe('Contact name'),
  email: z.email().optional().nullable().describe('Contact email'),
  phone_number: z.string().min(1).describe('Contact phone number'),
});

export const CreatePartnerBankAccountSchema = z.object({
  bank_id: z.uuid().describe('UUID of the associated Bank'),
  account_number: z.string().min(1).describe('Bank account number'),
  account_name: z.string().min(1).describe('Account holder name'),
});

const optionalString = z.string().optional().nullable();

export const PartnerAddressSchema = z.object({
  provinsi_id: optionalString.describe('Province ID'),
  provinsi_label: optionalString.describe('Province name'),
  kota_id: optionalString.describe('City/Regency ID'),
  kota_label: optionalString.describe('City/Regency name'),
  kecamatan_id: optionalString.describe('District ID'),
  kecamatan_label: optionalString.describe('District name'),
  kelurahan_id: optionalString.describe('Sub-district ID'),
  kelurahan_label: optionalString.describe('Sub-district name'),
  address: optionalString.describe('Full office address'),
  postal_code: optionalString.describe('Postal code'),
});

export const CreatePartnerSchema = z.object({
  user_id: z.uuid().describe('User ID the partner belongs to'),
  number: z.string().optional().nullable().describe('Partner unique identification number'),
  name: z.string().min(1).describe('Partner company name'),
  types: z
    .array(z.enum(['SUPPLIER', 'BUYER']))
    .min(1)
    .refine((items) => new Set(items).size === items.length, {
      message: 'Types must be unique',
    })
    .describe('Types of partner (SUPPLIER or BUYER)'),
  legal_entity: z
    .enum(['CV', 'PT', 'KOPERASI', 'INDIVIDUAL'])
    .describe('Legal entity type (CV, PT, etc.)'),
  company_email: z.email().describe('Official company email'),
  company_phone: z.string().min(1).describe('Official company phone number'),

  ...PartnerAddressSchema.shape,

  contacts: z.array(CreatePartnerContactSchema).optional().describe('List of contact persons'),
  partner_bank_accounts: z
    .array(CreatePartnerBankAccountSchema)
    .optional()
    .describe('List of bank accounts'),
});

export class PartnerCreatePayloadDto extends createZodDto(CreatePartnerSchema) {}
