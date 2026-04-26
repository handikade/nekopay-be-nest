import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserPresentationSchema } from './user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOne(id: string, currentUser: { id: string; role: string }) {
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException('You do not have permission to access this user');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserPresentationSchema.parse(user);
  }
}
