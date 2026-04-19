import {
  InternalServerErrorResponseDto,
  makeErrorResponseSchema,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from './error-response.type';

describe('Error Response Types', () => {
  describe('makeErrorResponseSchema', () => {
    const options = {
      statusCode: 400,
      message: 'Bad Request Message',
      error: 'Bad Request',
    };
    const schema = makeErrorResponseSchema(options);

    it('should validate a correct error response', () => {
      const validError = {
        statusCode: 400,
        message: 'Bad Request Message',
        error: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: '/test',
      };

      const result = schema.safeParse(validError);
      expect(result.success).toBe(true);
    });

    it('should fail if statusCode is not the literal value', () => {
      const invalidError = {
        statusCode: 401, // Different from 400
        message: 'Bad Request Message',
        error: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: '/test',
      };

      const result = schema.safeParse(invalidError);
      expect(result.success).toBe(false);
    });

    it('should fail if message is not the literal value', () => {
      const invalidError = {
        statusCode: 400,
        message: 'Different Message',
        error: 'Bad Request',
        timestamp: new Date().toISOString(),
        path: '/test',
      };

      const result = schema.safeParse(invalidError);
      expect(result.success).toBe(false);
    });

    it('should fail if error is not the literal value', () => {
      const invalidError = {
        statusCode: 400,
        message: 'Bad Request Message',
        error: 'Different Error',
        timestamp: new Date().toISOString(),
        path: '/test',
      };

      const result = schema.safeParse(invalidError);
      expect(result.success).toBe(false);
    });
  });

  describe('Standard Error DTOs', () => {
    it('UnauthorizedResponseDto should be defined', () => {
      expect(new UnauthorizedResponseDto()).toBeDefined();
    });

    it('NotFoundResponseDto should be defined', () => {
      expect(new NotFoundResponseDto()).toBeDefined();
    });

    it('InternalServerErrorResponseDto should be defined', () => {
      expect(new InternalServerErrorResponseDto()).toBeDefined();
    });
  });
});
