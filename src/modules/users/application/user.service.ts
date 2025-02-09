import { Injectable } from '@nestjs/common';
import { User } from '@module/users/domain/entities/User';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;

    return user;
  }
}
