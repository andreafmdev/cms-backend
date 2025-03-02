import { User } from '@module/users/domain/aggretates/user';
import { Injectable } from '@nestjs/common';
import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { UserDetailMapper } from './user-detail.mapper';
import { GroupMapper } from './group.mapper';
import { UserDetail } from '@module/users/domain/entities/user-detail';
import { UserDetailOrmEntity } from '../entities/user-detail.orm-entity';
import { Password } from '@module/users/domain/value-objects/password.vo';

// modules/users/infrastructure/mappers/user.mapper.ts
@Injectable()
export class UserMapper {
  constructor(
    private readonly groupMapper: GroupMapper,
    private readonly userDetailMapper: UserDetailMapper,
  ) {}

  /**
   * Maps ORM entity to domain entity
   */
  toDomain(orm: UserOrmEntity): User {
    if (!orm.username || !orm.email) {
      throw new Error('Required user fields are undefined');
    }

    const groups = orm.groups?.map((g) => this.groupMapper.toDomain(g)) ?? [];
    const details: UserDetail = this.userDetailMapper.toDomain(
      orm.details ?? new UserDetailOrmEntity(),
    );

    return User.create({
      username: orm.username,
      email: orm.email,
      password: Password.fromHashed(orm.password),
      groups: groups,
      details: details,
    });
  }

  /**
   * Maps domain entity to ORM entity
   */
  toPersistence(domainEntity: User): UserOrmEntity {
    const orm = new UserOrmEntity();

    orm.id = domainEntity.getId().toString();
    orm.username = domainEntity.getUsername();
    orm.email = domainEntity.getEmail().toString();
    orm.password = domainEntity.getPassword().getValue();
    orm.groups = domainEntity
      .getGroups()
      .map((g) => this.groupMapper.toPersistence(g));
    orm.details = domainEntity.getDetails()
      ? this.userDetailMapper.toPersistence(domainEntity.getDetails())
      : new UserDetailOrmEntity();

    return orm;
  }
}
