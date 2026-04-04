import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export class LoginDto extends createZodDto(LoginSchema) {}
