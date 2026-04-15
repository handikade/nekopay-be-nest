import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthRepository } from './auth.repository';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RegisterDto, RegisterSchema } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const validated = RegisterSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    const existingUser = await this.authRepository.findByEmailOrUsername(dto.email);
    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);
    await this.authRepository.createUser({
      ...dto,
      password: hashedPassword,
    });

    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto) {
    const validated = LoginSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    const user = await this.authRepository.findByEmailOrUsername(dto.identifier);
    if (!user || !(await argon2.verify(user.password, dto.password))) {
      throw new ConflictException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; username: string }>(token);
      const newPayload = { sub: payload.sub, username: payload.username };

      const accessToken = await this.jwtService.signAsync(newPayload);
      const refreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
      });

      return { accessToken, refreshToken };
    } catch {
      throw new ConflictException('Invalid refresh token');
    }
  }

  logout() {
    return { message: 'Logged out successfully' };
  }
}
