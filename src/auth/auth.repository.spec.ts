import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';

describe('AuthRepository', () => {
  let repository: AuthRepository;

  const mockUser: User = {
    id: 'user-id-123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword123',
    phone_number: null,
    role: 'user',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await repository.createUser(dto);

      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmailOrUsername', () => {
    it('should find a user by email or username', async () => {
      const identifier = 'test@example.com';

      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await repository.findByEmailOrUsername(identifier);

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const identifier = 'nonexistent@example.com';

      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const result = await repository.findByEmailOrUsername(identifier);

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });
});
