import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  ResponseErrorBadRequestDto,
  ResponseErrorForbiddenDto,
  ResponseErrorNotFoundDto,
  ResponseErrorUnauthorizedDto,
} from '../dtos/response-error.dto';

/**
 * Common Swagger response for 401 Unauthorized
 */
export function ApiAuthErrors() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      type: ResponseErrorUnauthorizedDto,
    }),
  );
}

/**
 * Common Swagger response for 400 Bad Request
 */
export function ApiValidationErrors() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad request (validation error)',
      type: ResponseErrorBadRequestDto,
    }),
  );
}

/**
 * Common Swagger responses for resource-specific errors (403, 404)
 */
export function ApiResourceErrors(resourceName: string) {
  return applyDecorators(
    ApiResponse({
      status: 403,
      description: 'Forbidden',
      type: ResponseErrorForbiddenDto,
    }),
    ApiResponse({
      status: 404,
      description: `${resourceName} not found`,
      type: ResponseErrorNotFoundDto,
    }),
  );
}
