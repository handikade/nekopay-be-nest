import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        message: 'User registered successfully',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        message: 'username: Invalid input: expected string, received undefined',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in and receive tokens' })
  @ApiResponse({
    status: 201,
    description: 'Login successful, returns access token',
    schema: {
      example: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNWRmNTU0ZC00NDI1LTRjYzQtODMzMy01ZTA1N2NjYTkxMzUiLCJ1c2VybmFtZSI6IkRpa2EiLCJpYXQiOjE3NzUzNzIwMzUsImV4cCI6MTc3NTM3MjkzNX0.o0h16bkHsfgFKNOo-aJPxIgd5eJWYFIe9DA7ohPko8o',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Invalid credentials',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        message: 'identifier: Invalid input: expected string, received undefined',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
    });
    return { accessToken };
  }
}
