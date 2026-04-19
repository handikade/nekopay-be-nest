import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Standard error response schema used by AllExceptionsFilter.
 */
export const ErrorResponseSchema = z.object({
  statusCode: z.number().int().describe('HTTP status code'),
  message: z.string().describe('Error message'),
  error: z.string().describe('Error type or short description'),
  timestamp: z.string().datetime().describe('ISO timestamp of the error'),
  path: z.string().describe('URL path where the error occurred'),
});

/**
 * DTO for error responses, used for Swagger documentation.
 */
export class ErrorResponseDto extends createZodDto(ErrorResponseSchema) {}

/**
 * Factory to create a specialized error response schema for Swagger documentation.
 * Uses z.literal() to ensure Swagger renders fixed examples.
 */
export const makeErrorResponseSchema = (options: {
  statusCode: number;
  message: string;
  error: string;
}) =>
  ErrorResponseSchema.extend({
    statusCode: z.literal(options.statusCode).describe('HTTP status code'),
    message: z.literal(options.message).describe('Error message'),
    error: z.literal(options.error).describe('Error type or short description'),
  });

/**
 * Helper to create a NestJS DTO class from a specialized error schema.
 */
export const makeErrorResponseDto = <T extends z.ZodTypeAny>(schema: T) => createZodDto(schema);

// Standard Error DTOs

export class UnauthorizedResponseDto extends makeErrorResponseDto(
  makeErrorResponseSchema({
    statusCode: 401,
    message: 'Unauthorized',
    error: 'Unauthorized',
  }),
) {}

export class NotFoundResponseDto extends makeErrorResponseDto(
  makeErrorResponseSchema({
    statusCode: 404,
    message: 'Not Found',
    error: 'Not Found',
  }),
) {}

export class InternalServerErrorResponseDto extends makeErrorResponseDto(
  makeErrorResponseSchema({
    statusCode: 500,
    message: 'Internal Server Error',
    error: 'Internal Server Error',
  }),
) {}

export class ConflictResponseDto extends makeErrorResponseDto(
  makeErrorResponseSchema({
    statusCode: 409,
    message: 'Conflict',
    error: 'Conflict',
  }),
) {}
