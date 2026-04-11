import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FindAllBankSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'name', 'code']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export class FindAllBankDto extends createZodDto(FindAllBankSchema) {}
