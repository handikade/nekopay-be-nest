import { ErrorResponseSchema } from '@core/filters/all-exceptions.filter';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const makeErrorResponseSchema = (options: {
  statusCode: number;
  message?: string;
  error?: string;
}) => {
  return ErrorResponseSchema.extend({
    statusCode: z.literal(options.statusCode).describe('HTTP status code'),
    ...(options.message && {
      message: z.literal(options.message).describe('Error message'),
    }),
    ...(options.error && {
      error: z.literal(options.error).describe('Error type or short description'),
    }),
  });
};

export class Error400DTO extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 400,
    message: 'Bad Request',
    error: 'Bad Request',
  }),
) {}

export class Error401DTO extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 401,
    message: 'Unauthorized',
    error: 'Unauthorized',
  }),
) {}

export class Error403DTO extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 403,
    message: 'Forbidden',
    error: 'Forbidden',
  }),
) {}

export class Error404DTO extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 404,
    message: 'Not Found',
    error: 'Not Found',
  }),
) {}

export class Error409DTO extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 409,
    message: 'Conflict',
    error: 'Conflict',
  }),
) {}

export class Error500DTO extends createZodDto(
  makeErrorResponseSchema({
    statusCode: 500,
    message: 'Internal Server Error',
    error: 'Internal Server Error',
  }),
) {}

// #region DECORATORS
export function ApiErrors400() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request / Validation Error',
      type: Error400DTO,
    }),
  );
}

export function ApiErrors401() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      type: Error401DTO,
    }),
  );
}

export function ApiErrors403() {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: 'Forbidden',
      type: Error403DTO,
    }),
  );
}

export function ApiErrors404(resourceName = 'Resource') {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: `${resourceName} not found`,
      type: Error404DTO,
    }),
  );
}

export function ApiErrors409() {
  return applyDecorators(
    ApiResponse({
      status: 409,
      description: 'Conflict',
      type: Error409DTO,
    }),
  );
}

export function ApiErrors500() {
  return applyDecorators(
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: Error500DTO,
    }),
  );
}
// #endregion DECORATORS
