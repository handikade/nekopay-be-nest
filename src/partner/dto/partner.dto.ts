import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  makeCreatedResponseSchema,
  makeResponseDto,
  makeResponseSchema,
} from '../../_core/types/response.type';
import { PartnerAddressSchema } from './partner-create-payload.dto';

/**
 * Represents the user summary included in partner responses.
 */
export const PartnerUserSchema = z.object({
  id: z.uuid().describe('User ID'),
  username: z.string().describe('Username'),
  email: z.email().describe('User email'),
  phone_number: z.string().optional().nullable().describe('User phone number'),
  role: z.enum(['admin', 'user']).describe('User role'),
});

/**
 * Represents PartnerContact model.
 */
export const PartnerContactSchema = z.object({
  id: z.uuid().describe('Contact ID'),
  name: z.string().describe('Contact name'),
  email: z.email().optional().nullable().describe('Contact email'),
  phone_number: z.string().describe('Contact phone number'),
  created_at: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
});

/**
 * Represents a simplified Bank model within PartnerBankAccount.
 */
export const PartnerBankSchema = z.object({
  id: z.uuid().describe('Bank ID'),
  code: z.string().describe('Bank code'),
  name: z.string().describe('Bank name'),
});

/**
 * Represents PartnerBankAccount model including nested Bank.
 */
export const PartnerBankAccountSchema = z.object({
  id: z.uuid().describe('Bank account ID'),
  bank_id: z.uuid().describe('Bank ID'),
  account_number: z.string().describe('Bank account number'),
  account_name: z.string().describe('Account holder name'),
  created_at: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
  bank: PartnerBankSchema.describe('Associated bank details'),
});

/**
 * Core partner fields common to most responses.
 */
export const PartnerBaseSchema = z.object({
  id: z.uuid().describe('Partner ID'),
  number: z.string().optional().nullable().describe('Partner unique identification number'),
  name: z.string().describe('Partner company name'),
  types: z.array(z.enum(['SUPPLIER', 'BUYER'])).describe('Partner types'),
  legal_entity: z.enum(['CV', 'PT', 'KOPERASI', 'INDIVIDUAL']).describe('Legal entity type'),
  company_email: z.email().describe('Company email'),
  company_phone: z.string().describe('Company phone number'),
  created_at: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
});

// --- Compositional Schemas ---

/**
 * Full partner details without user association.
 */
export const PartnerSchema = PartnerBaseSchema.extend({
  ...PartnerAddressSchema.shape,
  contacts: z.array(PartnerContactSchema).describe('List of contact persons'),
  partner_bank_accounts: z.array(PartnerBankAccountSchema).describe('List of bank accounts'),
});

/**
 * The "master" DTO including all relations.
 */
export const PartnerFullSchema = PartnerSchema.extend({
  user: PartnerUserSchema.describe('Associated user details'),
});

/**
 * Simplified schema for non-admin findAll results.
 */
export const PartnerResponseSchema = PartnerBaseSchema;

/**
 * Comprehensive schema for admin findAll results.
 */
export const PartnerAdminResponseSchema = PartnerBaseSchema.extend({
  ...PartnerAddressSchema.shape,
  user_id: z.uuid().describe('Associated user ID'),
  deleted_at: z
    .string()
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

/**
 * Schema for partner creation response (ID only).
 */
export const PartnerCreateResponseSchema = z.object({
  id: z.string().uuid().describe('Created partner ID'),
});

// --- DTO Classes ---

export class PartnerDto extends createZodDto(PartnerSchema) {}
export class PartnerFullDto extends createZodDto(PartnerFullSchema) {}
export class PartnerResponseDto extends createZodDto(PartnerResponseSchema) {}
export class PartnerAdminResponseDto extends createZodDto(PartnerAdminResponseSchema) {}
export class PartnerCreateResponseDto extends createZodDto(PartnerCreateResponseSchema) {}

// --- Wrapped Response DTOs for Swagger ---

export class PartnerSingleResponseDto extends makeResponseDto(
  makeResponseSchema(PartnerFullSchema),
) {}

export class PartnerCreateSingleResponseDto extends makeResponseDto(
  makeCreatedResponseSchema(PartnerCreateResponseSchema),
) {}

export class PartnerListResponseDto extends makeResponseDto(
  makeResponseSchema(z.array(PartnerAdminResponseSchema)),
) {}
