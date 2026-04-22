import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  statusCode: z.number().int().describe('HTTP status code'),
  message: z.string().describe('Error message'),
  error: z.string().describe('Error type or short description'),
  timestamp: z.string().describe('ISO timestamp of the error'),
  path: z.string().describe('URL path where the error occurred'),
});

export const makeErrorResponseSchema = (options: { statusCode: number }) =>
  ErrorResponseSchema.extend({
    statusCode: z.literal(options.statusCode).describe('HTTP status code'),
  });
