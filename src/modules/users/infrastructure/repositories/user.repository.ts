import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { Uuid } from '@shared/value-object/uuid.vo';

@Injectable()
export class UserRepository
  extends BaseRepository<UserOrmEntity, Uuid>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {
    super(userRepository);
  }
  async findById(id: string): Promise<UserOrmEntity | null> {
    const user = await super.findOneById(Uuid.fromString(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
