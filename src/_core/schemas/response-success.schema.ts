import { z } from 'zod';

const BaseSuccessResponseSchema = z.object({
  statusCode: z.literal(200).describe('HTTP status code'),
  message: z.string().min(1).describe('Response message. Example: Success'),
});

export const PaginationMetaSchema = z.object({
  total: z.number().describe('Total number of records'),
  page: z.number().describe('Current page number'),
  limit: z.number().describe('Number of records per page'),
  totalPages: z.number().describe('Total number of pages'),
});

// 200
export const makeSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseSuccessResponseSchema.extend({
    data: dataSchema,
  });

// 201
export const makeCreatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseSuccessResponseSchema.extend({
    statusCode: z.literal(201).describe('HTTP status code'),
    data: dataSchema,
  });

// 200 with pagiunation meta
export const makePaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  BaseSuccessResponseSchema.extend({
    data: dataSchema,
    meta: PaginationMetaSchema,
  });
