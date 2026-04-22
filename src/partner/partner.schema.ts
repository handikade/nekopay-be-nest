import { PartnerType } from '@prisma/client';
import { z } from 'zod';
import { PartnerBankAccountSchema } from '../partner-bank-account/partner-bank-account.schema';
import { PartnerContactSchema } from '../partner-contact/partner-contact.schema';

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

export const PartnerUserSchema = z.object({
  id: z.uuid().describe('User ID'),
  username: z.string().describe('Username'),
  email: z.email().describe('User email'),
  phone_number: z.string().optional().nullable().describe('User phone number'),
  role: z.enum(['admin', 'user']).describe('User role'),
});

export const PartnerBaseSchema = z.object({
  id: z.uuid().describe('Partner ID'),
  number: z.string().optional().nullable().describe('Partner unique identification number'),
  name: z.string().describe('Partner company name'),
  types: z.array(z.enum(['SUPPLIER', 'BUYER'])).describe('Partner types'),
  legal_entity: z.enum(['CV', 'PT', 'KOPERASI', 'INDIVIDUAL']).describe('Legal entity type'),
  company_email: z.email().describe('Company email'),
  company_phone: z.string().describe('Company phone number'),
  created_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
});

export const PartnerSchema = PartnerBaseSchema.extend({
  ...PartnerAddressSchema.shape,
  contacts: z.array(PartnerContactSchema).describe('List of contact persons'),
  partner_bank_accounts: z.array(PartnerBankAccountSchema).describe('List of bank accounts'),
});

export const PartnerFullSchema = PartnerSchema.extend({
  user: PartnerUserSchema.describe('Associated user details'),
});

export const PartnerResponseSchema = PartnerBaseSchema;

export const PartnerAdminResponseSchema = PartnerBaseSchema.extend({
  ...PartnerAddressSchema.shape,
  user_id: z.uuid().describe('Associated user ID'),
  deleted_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .optional()
    .nullable()
    .describe('Deletion timestamp'),
  user: PartnerUserSchema.pick({
    id: true,
    username: true,
    email: true,
  }).describe('Associated user summary'),
});

export const PartnerCreateResponseSchema = z.object({
  id: z.uuid().describe('Created partner ID'),
});

export const PartnerNextNumberSchema = z.object({
  number: z.string().describe('The predicted next partner number'),
});

export const PartnerQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  type: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : undefined),
      z.array(z.enum(PartnerType)),
    )
    .optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'name']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

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

export const CreatePartnerSchema = z.object({
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

export const InternalCreatePartnerSchema = CreatePartnerSchema.extend({
  user_id: z.uuid().describe('User ID the partner belongs to'),
});

export const UpdatePartnerSchema = CreatePartnerSchema.partial();
