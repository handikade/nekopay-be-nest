import {
  makePaginatedResponseSchema,
  makeSuccessResponseSchema,
} from '@core/schemas/response-success.schema';
import { createZodDto } from 'nestjs-zod';
import { TaxListSchema, TaxPresentationSchema, TaxQueryParamsSchema } from './tax.schema';

export class TaxQueryParamsDTO extends createZodDto(TaxQueryParamsSchema) {}

export class TaxListResponseDTO extends createZodDto(makePaginatedResponseSchema(TaxListSchema)) {}
export class TaxResponseDTO extends createZodDto(
  makeSuccessResponseSchema(TaxPresentationSchema),
) {}
