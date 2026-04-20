import { createZodDto } from 'nestjs-zod';
import { InvoiceCreateSchema } from './invoice-create-payload.dto';

export const InvoiceUpdateSchema = InvoiceCreateSchema.partial().omit({
  user_id: true,
});

export class InvoiceUpdatePayloadDto extends createZodDto(InvoiceUpdateSchema) {}
