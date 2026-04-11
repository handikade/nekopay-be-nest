import { createZodDto } from 'nestjs-zod';
import { CreatePartnerSchema } from './create-partner.dto';

export const UpdatePartnerSchema = CreatePartnerSchema.omit({ user_id: true }).partial();

export class UpdatePartnerDto extends createZodDto(UpdatePartnerSchema) {}
