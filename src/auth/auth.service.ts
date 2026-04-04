import { Injectable, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
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
}
