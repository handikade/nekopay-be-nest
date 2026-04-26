import {
  makePaginatedResponseSchema,
  makeSuccessResponseSchema,
} from '@core/schemas/response-success.schema';
import { createZodDto } from 'nestjs-zod';
import {
  UserCreateSchema,
  UserListSchema,
  UserPresentationSchema,
  UserQueryParamsSchema,
} from './user.schema';

export class UserCreateDTO extends createZodDto(UserCreateSchema) {}
export class UserQueryParamsDTO extends createZodDto(UserQueryParamsSchema) {}
export class UserPresentationDTO extends createZodDto(UserPresentationSchema) {}

/**
 * Swagger Response Wrappers
 */
export class UserResponseDTO extends createZodDto(
  makeSuccessResponseSchema(UserPresentationSchema),
) {}

export class UserListResponseDTO extends createZodDto(
  makePaginatedResponseSchema(UserListSchema),
) {}
