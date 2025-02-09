import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@module/users/domain/entities/User';
import { Uuid } from '@shared/value-object/uuid.vo';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}
  findById(id: number): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  create(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  update(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map(
      (user) => new User(new Uuid(user.id), user.username, user.email, '', []),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;

    return new User(
      new Uuid(user.id),
      user.username,
      user.email,
      user.password,
      [],
    );
  }
}
