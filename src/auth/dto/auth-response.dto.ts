import { z } from 'zod';
import {
  makeErrorResponseDto,
  makeErrorResponseSchema,
} from '../../_core/types/error-response.type';
import { makeCreatedResponseSchema, makeResponseDto } from '../../_core/types/response.type';

/**
 * Schema for register success response.
 */
export const RegisterSuccessSchema = z.object({
  message: z.string().describe('Success message'),
});

/**
 * Schema for login success response.
 */
export const LoginSuccessSchema = z.object({
  accessToken: z.string().describe('JWT access token'),
});

/**
 * DTO for successful user registration.
 */
export class RegisterSuccessResponseDto extends makeResponseDto(
  makeCreatedResponseSchema(RegisterSuccessSchema),
) {}

/**
 * DTO for successful user login.
 */
export class LoginSuccessResponseDto extends makeResponseDto(
  makeCreatedResponseSchema(LoginSuccessSchema),
) {}

/**
 * DTO for conflict error during registration.
 */
export class RegisterConflictResponseDto extends makeErrorResponseDto(
  makeErrorResponseSchema({
    statusCode: 409,
    message: 'Email or username already exists',
    error: 'Conflict',
  }),
) {}

/**
 * DTO for conflict error during login.
 */
export class LoginConflictResponseDto extends makeErrorResponseDto(
  makeErrorResponseSchema({
    statusCode: 409,
    message: 'Invalid credentials',
    error: 'Conflict',
  }),
) {}
