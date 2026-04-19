import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorResponseDto } from '../_core/types/error-response.type';
import { AuthService } from './auth.service';
import {
  LoginConflictResponseDto,
  LoginSuccessResponseDto,
  RegisterConflictResponseDto,
  RegisterSuccessResponseDto,
} from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

import type { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; role: string };
  cookies: Record<string, string>;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user account
   */
  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterSuccessResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Email or username already exists',
    type: RegisterConflictResponseDto,
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

  /**
   * Log in and receive tokens
   */
  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'Login successful, returns access token',
    type: LoginSuccessResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Invalid credentials',
    type: LoginConflictResponseDto,
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
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return { accessToken };
  }

  /**
   * Refresh access token
   */
  @Post('refresh')
  @ApiResponse({
    status: 201,
    description: 'Refresh successful, returns new access token',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing refresh token',
  })
  async refresh(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken'];
    if (!token) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const { accessToken, refreshToken } = await this.authService.refresh(token);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Log out and clear tokens
   */
  @Post('logout')
  @ApiResponse({
    status: 201,
    description: 'Logout successful',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    return this.authService.logout();
  }

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  /**
   * Get current user profile
   */
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
