import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(8),
  phone_number: z.string().optional(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
