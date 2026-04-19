import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const TaxQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'code', 'rate', 'created_at', 'updated_at']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export class TaxQueryDto extends createZodDto(TaxQuerySchema) {}
