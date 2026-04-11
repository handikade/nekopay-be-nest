import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBankSchema = z.object({
  code: z.string().min(1).describe('Bank code'),
  name: z.string().min(1).describe('Bank name'),
});

export class CreateBankDto extends createZodDto(CreateBankSchema) {}
