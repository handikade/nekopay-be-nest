import { PartnerType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const FindAllPartnerSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  type: z
    .preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : undefined),
      z.array(z.enum(PartnerType)),
    )
    .optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'name']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export class PartnerQueryDto extends createZodDto(FindAllPartnerSchema) {}
