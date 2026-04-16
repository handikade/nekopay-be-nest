import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Base response schema for fields shared by all responses.
 */
const BaseResponseSchema = z.object({
  statusCode: z.number().int().describe('HTTP status code'),
  message: z.string().min(1).describe('Response message'),
  meta: z
    .record(z.string(), z.unknown())
    .optional()
    .describe('Optional metadata (e.g., pagination)'),
});

/**
 * Generic Response type derived from the base schema.
 * Deriving from Zod ensures consistency across the application.
 */
export type Response<T> = z.infer<typeof BaseResponseSchema> & {
  data: T;
};

/**
 * Factory to create a Zod schema for a specific data type.
 * Useful for validation and Swagger/OpenAPI documentation.
 */
export const makeResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseResponseSchema.extend({
    data: dataSchema,
  });

/**
 * Factory to create a NestJS DTO class from a Zod schema.
 */
export const makeResponseDto = <T extends z.ZodTypeAny>(schema: T) => createZodDto(schema);
