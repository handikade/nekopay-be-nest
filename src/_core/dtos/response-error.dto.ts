import { createZodDto } from 'nestjs-zod';
import { makeErrorResponseSchema } from '../schemas/response-error.schema';

export class ResponseErrorBadRequestDto extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 400,
  }),
) {}

export class ResponseErrorUnauthorizedDto extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 401,
  }),
) {}

export class ResponseErrorForbiddenDto extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 403,
  }),
) {}

export class ResponseErrorNotFoundDto extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 404,
  }),
) {}

export class ResponseErrorConflictDto extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 409,
  }),
) {}

export class ResponseErrorInternalServerDto extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 500,
  }),
) {}
