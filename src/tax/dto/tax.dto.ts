import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  makePaginatedResponseSchema,
  makeResponseDto,
  makeResponseSchema,
} from '../../_core/types/response.type';

export const TaxSchema = z.object({
  id: z.uuid().describe('Tax ID'),
  code: z.string().describe('Tax code'),
  rate: z
    .any()
    .transform((val) => Number(val))
    .describe('Tax rate'),
  type: z.enum(['INCLUSIVE', 'EXCLUSIVE']).describe('Tax type'),
  name: z.string().describe('Tax name'),
  created_at: z
    .unknown()
    .transform((val) => new Date(val as string | number | Date))
    .describe('Creation timestamp'),
  updated_at: z
    .unknown()
    .transform((val) => new Date(val as string | number | Date))
    .describe('Last update timestamp'),
});

export class TaxDto extends createZodDto(TaxSchema) {}

export class TaxSingleResponseDto extends makeResponseDto(makeResponseSchema(TaxSchema)) {}

export class TaxListResponseDto extends makeResponseDto(
  makePaginatedResponseSchema(z.array(TaxSchema)),
) {}
