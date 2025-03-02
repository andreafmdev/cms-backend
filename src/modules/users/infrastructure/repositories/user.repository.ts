import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@userModule/domain/repositories/user-repository';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { UserId } from '@module/users/domain/value-objects/user-id.vo';

@Injectable()
export class UserRepository
  extends BaseRepository<UserOrmEntity, UserId>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {
    super(ormRepository);
  }
  async findById(id: UserId): Promise<UserOrmEntity | null> {
    const user = await super.findById(id);

    return user;
  }
}
