import { createZodDto } from 'nestjs-zod';
import { CreatePartnerSchema } from './partner-create-payload.dto';

export const UpdatePartnerSchema = CreatePartnerSchema.partial();

export class PartnerUpdatePayloadDto extends createZodDto(UpdatePartnerSchema) {}
