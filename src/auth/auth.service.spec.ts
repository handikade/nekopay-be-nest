import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: 'user-id-123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword123',
    created_at: new Date(),
    updated_at: new Date(),
    phone_number: '1234567890',
    role: 'user',
  };

  const mockUserRepository = {
    findByEmailOrUsername: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login and return tokens', async () => {
      mockUserRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      mockJwtService.signAsync
        .mockResolvedValueOnce('mockAccessToken')
        .mockResolvedValueOnce('mockRefreshToken');

      const result = await service.login(loginDto);

      expect(mockUserRepository.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier);
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, loginDto.password);

      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(1, {
        sub: mockUser.id,
        username: mockUser.username,
      });
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: mockUser.id, username: mockUser.username },
        { expiresIn: '7d' },
      );

      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
      });
    });

    it('should throw ConflictException if user is not found', async () => {
      mockUserRepository.findByEmailOrUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(ConflictException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');

      expect(mockUserRepository.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier);
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if password is invalid', async () => {
      mockUserRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(ConflictException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');

      expect(mockUserRepository.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier);
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, loginDto.password);
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should successfully refresh tokens', async () => {
      const mockPayload = { sub: mockUser.id, username: mockUser.username };
      const mockToken = 'valid-refresh-token';

      jest.spyOn(mockJwtService, 'verifyAsync').mockResolvedValue(mockPayload);
      mockJwtService.signAsync
        .mockResolvedValueOnce('newAccessToken')
        .mockResolvedValueOnce('newRefreshToken');

      const result = await service.refresh(mockToken);

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });
    });

    it('should throw ConflictException if refresh token is invalid', async () => {
      const mockToken = 'invalid-refresh-token';
      jest.spyOn(mockJwtService, 'verifyAsync').mockRejectedValue(new Error());

      await expect(service.refresh(mockToken)).rejects.toThrow(ConflictException);
      await expect(service.refresh(mockToken)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should return logout success message', () => {
      const result = service.logout();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
