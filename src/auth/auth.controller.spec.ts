import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      const expectedResult = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
      };
      mockUserService.create.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockUserService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should successfully login and set refresh token cookie', async () => {
      const loginDto: LoginDto = {
        identifier: 'test@example.com',
        password: 'password123',
      };

      const tokens = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      };

      mockAuthService.login.mockResolvedValue(tokens);

      const cookieSpy = jest.fn();
      const mockResponse = {
        cookie: cookieSpy,
      } as unknown as Response;

      const result = await controller.login(loginDto, mockResponse);

      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);

      expect(cookieSpy).toHaveBeenCalledTimes(1);
      expect(cookieSpy).toHaveBeenCalledWith('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });

      expect(result).toEqual({ accessToken: tokens.accessToken });
    });
  });
});
