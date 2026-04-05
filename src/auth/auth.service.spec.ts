import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

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

  const mockAuthRepository = {
    findByEmailOrUsername: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
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

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      mockAuthRepository.findByEmailOrUsername.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockAuthRepository.createUser.mockResolvedValue({ ...mockUser, ...registerDto });

      const result = await service.register(registerDto);

      expect(mockAuthRepository.findByEmailOrUsername).toHaveBeenCalledWith(registerDto.email);
      expect(argon2.hash).toHaveBeenCalledWith(registerDto.password);
      expect(mockAuthRepository.createUser).toHaveBeenCalledWith({
        ...registerDto,
        password: 'hashedpassword',
      });
      expect(result).toEqual({ message: 'User registered successfully' });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockAuthRepository.findByEmailOrUsername.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow(
        'Email or username already exists',
      );

      expect(mockAuthRepository.findByEmailOrUsername).toHaveBeenCalledWith(registerDto.email);
      expect(argon2.hash).not.toHaveBeenCalled();
      expect(mockAuthRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      identifier: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login and return tokens', async () => {
      mockAuthRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      mockJwtService.signAsync
        .mockResolvedValueOnce('mockAccessToken')
        .mockResolvedValueOnce('mockRefreshToken');

      const result = await service.login(loginDto);

      expect(mockAuthRepository.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier);
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
      mockAuthRepository.findByEmailOrUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(ConflictException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');

      expect(mockAuthRepository.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier);
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if password is invalid', async () => {
      mockAuthRepository.findByEmailOrUsername.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(ConflictException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');

      expect(mockAuthRepository.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.identifier);
      expect(argon2.verify).toHaveBeenCalledWith(mockUser.password, loginDto.password);
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
