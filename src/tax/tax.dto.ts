import { createZodDto } from 'nestjs-zod';
import {
  makePaginatedResponseSchema,
  makeSuccessResponseSchema,
} from '../_core/schemas/response-success.schema';
import { TaxArrayResponseSchema, TaxQuerySchema, TaxResponseSchema, TaxSchema } from './tax.schema';

export class TaxDto extends createZodDto(TaxSchema) {}
export class TaxQueryDto extends createZodDto(TaxQuerySchema) {}
export class TaxSingleResponseDto extends createZodDto(TaxSchema) {}

export class TaxListResponseDto extends createZodDto(
  makePaginatedResponseSchema(TaxArrayResponseSchema),
) {}
export class TaxResponseDto extends createZodDto(makeSuccessResponseSchema(TaxResponseSchema)) {}
