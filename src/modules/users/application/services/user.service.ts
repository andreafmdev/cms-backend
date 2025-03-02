import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '@module/users/infrastructure/repositories/user.repository';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { UserDetailMapper } from '@module/users/infrastructure/mapper/user-detail.mapper';
import { User } from '@module/users/domain/aggretates/user';
import { UserId } from '@module/users/domain/value-objects/user-id.vo';
import { Password } from '@module/users/domain/value-objects/password.vo';

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

  async findUserById(id: UserId): Promise<User | null> {
    const userOrm = await this.userRepository.findById(id);
    return userOrm ? this.userMapper.toDomain(userOrm) : null;
  }
  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User | null> {
    const userPresent = await this.userRepository.findOneByCondition({
      where: [{ email }, { username }],
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
    const userOrm = this.userMapper.toPersistence(user);
    //Save user on db
    await this.userRepository.save(userOrm);
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const userOrm = await this.userRepository.findOneByCondition({
      where: { email },
    });
    return userOrm ? this.userMapper.toDomain(userOrm) : null;
  }
  async findAllUsers(): Promise<User[]> {
    const usersOrm = await this.userRepository.findAll();
    return usersOrm.map((userOrm) => this.userMapper.toDomain(userOrm));
  }
}
