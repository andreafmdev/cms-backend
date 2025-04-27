import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '@module/users/infrastructure/repositories/user.repository';
import { User } from '@module/users/domain/aggretates/user';
import { UserId } from '@module/users/domain/value-objects/user-id.vo';
import { Password } from '@module/users/domain/value-objects/password.vo';
import { UserFilterDto } from '../dto/user-filter.dto';

/**
 * Service responsible for managing group-related operations
 */
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: UserId): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    return user ?? null;
  }

  async findUsersByFilters(filters: Partial<UserFilterDto>): Promise<User[]> {
    const userOrm = await this.userRepository.findAllByCondition(filters);
    return userOrm;
  }
  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User | null> {
    const userPresent = await this.userRepository.findOneByCondition({
      email,
      username,
    });
    if (userPresent) {
      throw new BadRequestException('User already exists');
    }
    //Crete user on domain
    const user: User = User.create({
      username,
      email,
      password: Password.fromPlaintext(password),
    });
    //Map user to orm
    //Save user on db
    await this.userRepository.save(user);
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneByCondition({
      email,
    });
    return user ?? null;
  }
  async findOneById(id: UserId): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    return user ?? null;
  }
  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }
  async countUsersByFilters(filters: Partial<UserFilterDto>): Promise<number> {
    return this.userRepository.count(filters);
  }
}
