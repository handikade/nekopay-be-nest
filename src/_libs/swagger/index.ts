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

// #region DECORATORS
export function ApiErrors400() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request / Validation Error',
      type: createZodDto(
        makeErrorResponseSchema({
          statusCode: 400,
          message: 'Bad Request',
          error: 'Bad Request',
        }),
      ),
    }),
  );
}

export function ApiErrors401() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      type: createZodDto(
        makeErrorResponseSchema({
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        }),
      ),
    }),
  );
}

export function ApiErrors403() {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: 'Forbidden',
      type: createZodDto(
        makeErrorResponseSchema({
          statusCode: 403,
          message: 'Forbidden',
          error: 'Forbidden',
        }),
      ),
    }),
  );
}

export function ApiErrors404(resourceName = 'Resource') {
  return applyDecorators(
    ApiResponse({
      status: 404,
      description: `${resourceName} not found`,
      type: createZodDto(
        makeErrorResponseSchema({
          statusCode: 404,
          message: 'Not Found',
          error: 'Not Found',
        }),
      ),
    }),
  );
}

export function ApiErrors409() {
  return applyDecorators(
    ApiResponse({
      status: 409,
      description: 'Conflict',
      type: createZodDto(
        makeErrorResponseSchema({
          statusCode: 409,
          message: 'Conflict',
          error: 'Conflict',
        }),
      ),
    }),
  );
}

export function ApiErrors500() {
  return applyDecorators(
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: createZodDto(
        makeErrorResponseSchema({
          statusCode: 500,
          message: 'Internal Server Error',
          error: 'Internal Server Error',
        }),
      ),
    }),
  );
}
// #endregion DECORATORS
