import { makePaginatedResponseSchema } from '@core/schemas/response-success.schema';
import { BankCreateInputSchema, BankUpdateInputSchema } from '@prisma/zod';
import { createZodDto } from 'nestjs-zod';
import { BankListSchema, BankPresentationSchema, BankQueryParamsSchema } from './bank.schema';

export class BankCreateDTO extends createZodDto(BankCreateInputSchema) {}
export class BankUpdateDTO extends createZodDto(BankUpdateInputSchema) {}
export class BankQueryParamsDTO extends createZodDto(BankQueryParamsSchema) {}
export class BankPresentationDTO extends createZodDto(BankPresentationSchema) {}

export class BankListResponseDTO extends createZodDto(
  makePaginatedResponseSchema(BankListSchema),
) {}
