import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { UserId } from '@module/users/domain/value-objects/user-id.vo';
import { UserMapper } from '../mapper/user-mapper';
import { User } from '@module/users/domain/aggretates/user';
@Injectable()
export class UserRepository
  extends BaseRepository<User, UserOrmEntity, UserId>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserOrmEntity)
    repo: Repository<UserOrmEntity>,
    mapper: UserMapper,
  ) {
    super(repo, mapper);
  }
  async findById(id: UserId): Promise<User | null> {
    const user = await super.findById(id);

    return user;
  }
}
