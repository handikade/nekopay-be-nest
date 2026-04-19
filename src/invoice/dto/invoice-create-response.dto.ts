import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const InvoiceCreateResponseSchema = z.object({
  id: z.string().uuid().describe('Created invoice ID'),
});

export class InvoiceCreateResponseDto extends createZodDto(InvoiceCreateResponseSchema) {}
