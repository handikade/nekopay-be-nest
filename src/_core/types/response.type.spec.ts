import { z } from 'zod';
import { makeResponseSchema } from './response.type';

describe('makeResponseSchema', () => {
  it('should validate a correct response', () => {
    const dataSchema = z.object({ id: z.number(), name: z.string() });
    const responseSchema = makeResponseSchema(dataSchema);

    const validResponse = {
      statusCode: 200,
      message: 'Success',
      data: { id: 1, name: 'Test' },
      meta: { total: 1 },
    };

    const result = responseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should validate correctly without meta', () => {
    const dataSchema = z.string();
    const responseSchema = makeResponseSchema(dataSchema);

    const validResponse = {
      statusCode: 200,
      message: 'Success',
      data: 'Some Data',
    };

    const result = responseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should fail on invalid data', () => {
    const dataSchema = z.number();
    const responseSchema = makeResponseSchema(dataSchema);

    const invalidResponse = {
      statusCode: 200,
      message: 'Success',
      data: 'Invalid data type',
    };

    const result = responseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should fail on missing required fields', () => {
    const dataSchema = z.any();
    const responseSchema = makeResponseSchema(dataSchema);

    const invalidResponse = {
      statusCode: 200,
      // message is missing
      data: {},
    };

    const result = responseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should fail on non-integer statusCode', () => {
    const dataSchema = z.any();
    const responseSchema = makeResponseSchema(dataSchema);

    const invalidResponse = {
      statusCode: 200.5,
      message: 'Success',
      data: {},
    };

    const result = responseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });

  it('should fail on empty message', () => {
    const dataSchema = z.any();
    const responseSchema = makeResponseSchema(dataSchema);

    const invalidResponse = {
      statusCode: 200,
      message: '',
      data: {},
    };

    const result = responseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });
});
