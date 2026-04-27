import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole } from '@prisma/client';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUser: User = {
    id: 'user-id-123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword123',
    created_at: new Date(),
    updated_at: new Date(),
    phone_number: '1234567890',
    role: UserRole.user,
  };

  const mockUserRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const query = {
      page: 1,
      limit: 10,
      sortBy: 'created_at' as const,
      sortOrder: 'desc' as const,
    };

    it('should successfully return paginated users', async () => {
      const users = [mockUser];
      const total = 1;
      mockUserRepository.findAll.mockResolvedValue([total, users]);

      const result = await service.findAll(query);

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({}, 0, 10, { created_at: 'desc' });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(total);
      expect(result.meta.totalPages).toBe(1);
      expect(result.data[0]).not.toHaveProperty('password');
    });

    it('should apply search filter if provided', async () => {
      const searchQuery = { ...query, search: 'test' };
      mockUserRepository.findAll.mockResolvedValue([0, []]);

      await service.findAll(searchQuery);

      expect(mockUserRepository.findAll).toHaveBeenCalledWith(
        {
          OR: [
            { username: { contains: 'test', mode: 'insensitive' } },
            { email: { contains: 'test', mode: 'insensitive' } },
            { phone_number: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        0,
        10,
        { created_at: 'desc' },
      );
    });
  });
});
