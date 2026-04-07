import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

import type { Response, Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string; role: string };
  cookies: Record<string, string>;
}

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

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
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
        secure: true,
        path: '/',
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out and clear tokens' })
  @ApiResponse({
    status: 201,
    description: 'Logout successful',
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      path: '/',
    });
    return this.authService.logout();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
  })
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
