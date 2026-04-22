import { z } from 'zod';

export const PartnerContactSchema = z.object({
  id: z.uuid().describe('Contact ID'),
  name: z.string().describe('Contact name'),
  email: z.email().optional().nullable().describe('Contact email'),
  phone_number: z.string().describe('Contact phone number'),
  created_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Creation timestamp'),
  updated_at: z.iso
    .datetime()
    .transform((val) => new Date(val))
    .describe('Last update timestamp'),
});
