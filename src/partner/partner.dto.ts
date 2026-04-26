import { PartnerCreateInputSchema, PartnerUpdateInputSchema } from '@prisma/zod';
import { createZodDto } from 'nestjs-zod';
import {
  makeCreatedResponseSchema,
  makePaginatedResponseSchema,
  makeSuccessResponseSchema,
} from '../_core/schemas/response-success.schema';
import {
  PartnerIdSchema,
  PartnerListSchema,
  PartnerNumberSchema,
  PartnerPresentationSchema,
  PartnerQuerySchema,
} from './partner.schema';

export class PartnerCreateInputDTO extends createZodDto(PartnerCreateInputSchema) {}
export class PartnerUpdateInputDTO extends createZodDto(PartnerUpdateInputSchema) {}
export class PartnerQueryDTO extends createZodDto(PartnerQuerySchema) {}
export class PartnerPresentationDTO extends createZodDto(PartnerPresentationSchema) {}
export class PartnerListDTO extends createZodDto(PartnerListSchema) {}

// #region SWAGGER WRAPPERS

export class ResponseSuccessPartnerNextNumberDto extends createZodDto(
  makeSuccessResponseSchema(PartnerNumberSchema),
) {}
export class ResponseSuccessPartnerCreateDto extends createZodDto(
  makeCreatedResponseSchema(PartnerIdSchema),
) {}
export class ResponseSuccessPartnerViewDto extends createZodDto(
  makeSuccessResponseSchema(PartnerPresentationSchema),
) {}
export class ResponseSuccessPartnerUpdateDto extends createZodDto(
  makeSuccessResponseSchema(PartnerIdSchema),
) {}
export class ResponseSuccessPartnerListDto extends createZodDto(
  makePaginatedResponseSchema(PartnerListSchema),
) {}
// #endregion SWAGGER WRAPPERS
