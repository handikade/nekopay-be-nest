import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const LoginSchema = z.object({
  identifier: z.string().describe('Email or username for login'),
  password: z.string().describe('User password'),
});

export class LoginDto extends createZodDto(LoginSchema) {}
