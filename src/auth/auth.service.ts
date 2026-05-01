import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserRepository } from '../user/user.repository';
import { LoginDto, LoginSchema } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const validated = LoginSchema.safeParse(dto);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0];
      throw new BadRequestException(`${firstIssue.path.join('.')}: ${firstIssue.message}`);
    }

    const { identifier, password } = dto;
    const user: User | null = await this.userRepository.findByEmailOrUsername(identifier);

    if (!user) {
      throw new ConflictException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid credentials');
    }

    const payload: { sub: string; username: string } = {
      sub: user.id,
      username: user.username,
    };
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
