import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  makeCreatedResponseSchema,
  makePaginatedResponseSchema,
  makeSuccessResponseSchema,
} from '../_core/schemas/response-success.schema';
import {
  CreatePartnerSchema,
  InternalCreatePartnerSchema,
  PartnerAdminResponseSchema,
  PartnerCreateResponseSchema,
  PartnerFullSchema,
  PartnerNextNumberSchema,
  PartnerQuerySchema,
  PartnerResponseSchema,
  PartnerSchema,
  UpdatePartnerSchema,
} from './partner.schema';

// #region DTOS
export class PartnerDto extends createZodDto(PartnerSchema) {}
export class PartnerFullDto extends createZodDto(PartnerFullSchema) {}
export class PartnerResponseDto extends createZodDto(PartnerResponseSchema) {}
export class PartnerAdminResponseDto extends createZodDto(PartnerAdminResponseSchema) {}
export class PartnerCreateResponseDto extends createZodDto(PartnerCreateResponseSchema) {}
export class PartnerNextNumberDto extends createZodDto(PartnerNextNumberSchema) {}
export class PartnerQueryDto extends createZodDto(PartnerQuerySchema) {}
export class PartnerCreatePayloadDto extends createZodDto(CreatePartnerSchema) {}
export class PartnerUpdatePayloadDto extends createZodDto(UpdatePartnerSchema) {}
// #endregion DTOS

// #region TYPES
export type InternalCreatePartner = z.infer<typeof InternalCreatePartnerSchema>;
// #endregion TYPES

// #region SWAGGER WRAPPERS
export class ResponseSuccessPartnerSingleDto extends createZodDto(
  makeSuccessResponseSchema(PartnerFullSchema),
) {}
export class ResponseSuccessPartnerIdOnlyDto extends createZodDto(
  makeCreatedResponseSchema(PartnerCreateResponseSchema),
) {}
export class ResponseSuccessPartnerListDto extends createZodDto(
  makePaginatedResponseSchema(z.array(PartnerAdminResponseSchema)),
) {}
export class ResponseSuccessPartnerNextNumberDto extends createZodDto(
  makeSuccessResponseSchema(PartnerNextNumberSchema),
) {}
// #endregion SWAGGER WRAPPERS
