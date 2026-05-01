import { SortOrderSchema, UserScalarFieldEnumSchema, UserSchema } from '@prisma/zod';
import { z } from 'zod';

export const UserCreateSchema = UserSchema.omit({
  id: true,
  password: true,
  created_at: true,
  updated_at: true,
  role: true,
  phone_number: true,
}).extend({
  password: z.string().min(8).describe('User password'),
  role: z.enum(['admin', 'user']).optional().describe('User role'),
  phone_number: z.string().optional().describe('User phone number'),
});

export const UserQueryParamsSchema = z.object({
  page: z.coerce.number().default(1).describe('Page number'),
  limit: z.coerce.number().default(10).describe('Number of items per page'),
  search: z.string().optional().describe('Search keyword'),
  sortBy: UserScalarFieldEnumSchema.optional().default('created_at'),
  sortOrder: SortOrderSchema.optional().default('desc'),
});

export const UserPresentationSchema = UserSchema.omit({
  password: true,
  created_at: true,
  updated_at: true,
});

export const UserListSchema = z.array(UserPresentationSchema);
