import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { User } from '@userModule/domain/entities/User';

@Injectable()
export class UserRepository implements IUserRepository {
  private userRepository: Repository<UserOrmEntity>;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource, // ✅ Iniettato direttamente
  ) {
    this.userRepository = this.dataSource.getRepository(UserOrmEntity);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? new User(user.username, user.email, user.password) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? new User(user.username, user.email, user.password) : null;
  }

  async create(user: User): Promise<User> {
    const ormUser = this.userRepository.create({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    const savedUser = await this.userRepository.save(ormUser);
    return new User(savedUser.username, savedUser.email, savedUser.password);
  }

  async update(user: User): Promise<User> {
    await this.userRepository.update(user.id.toString(), {
      username: user.username,
      email: user.email,
      password: user.password,
    });
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((u) => new User(u.username, u.email, u.password));
  }
}
