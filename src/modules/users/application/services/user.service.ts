import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from '@module/users/infrastructure/repositories/user.repository';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { UserDetailMapper } from '@module/users/infrastructure/mapper/user-detail.mapper';
import { User } from '@module/users/domain/aggretates/user';

/**
 * Service responsible for managing group-related operations
 */
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly userDetailMapper: UserDetailMapper,
  ) {}

  async findUserById(id: string): Promise<User> {
    const userOrm = await this.userRepository.findById(id);
    if (!userOrm) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.userMapper.toDomain(userOrm);
  }
}
