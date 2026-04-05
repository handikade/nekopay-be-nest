import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const RegisterSchema = z.object({
  username: z.string().describe('Unique username'),
  email: z.email().describe('User email address'),
  password: z.string().min(8).describe('Strong password with minimum 8 characters'),
  phone_number: z.string().optional().describe('Optional contact number'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
