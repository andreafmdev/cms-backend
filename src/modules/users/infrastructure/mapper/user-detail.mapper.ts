import { UserDetail } from '@module/users/domain/entities/user-detail';
import { UserDetailOrmEntity } from '@module/users/infrastructure/entities/user-detail.orm-entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDetailMapper {
  toDomain(ormEntity: UserDetailOrmEntity): UserDetail {
    return UserDetail.create(
      ormEntity.address,
      ormEntity.phoneNumber,
      ormEntity.profilePictureUrl,
      ormEntity.biography,
    );
  }

  toPersistence(domainEntity: UserDetail): UserDetailOrmEntity {
    const orm = new UserDetailOrmEntity();
    orm.address = domainEntity.getAddress();
    orm.phoneNumber = domainEntity.getPhoneNumber();
    orm.profilePictureUrl = domainEntity.getProfilePictureUrl();
    orm.biography = domainEntity.getBiography();
    return orm;
  }
}
