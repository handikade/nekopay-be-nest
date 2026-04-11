import { createZodDto } from 'nestjs-zod';
import { CreateBankSchema } from './create-bank.dto';

export const UpdateBankSchema = CreateBankSchema.partial();

export class UpdateBankDto extends createZodDto(UpdateBankSchema) {}
