import { User } from '@module/users/domain/entities/User';
import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { AutoMapper } from '@shared/mappers/auto-mapper';
import { Group } from '@module/users/domain/entities/Group';
import { Permission } from '@module/users/domain/entities/Permission';
import { UserDetail } from '@module/users/domain/entities/UserDetail';
import { Injectable } from '@nestjs/common';
@Injectable()
export class UserMapper extends AutoMapper<UserOrmEntity, User> {
  constructor() {
    super(
      (data: UserOrmEntity) =>
        User.createWithId(
          data.id,
          data.username,
          data.email,
          data.password,
          (data.groups ?? []).map((group) =>
            Group.createWithId(
              group.id,
              group.name,
              (group.permissions ?? []).map((p) =>
                Permission.createWithId(p.id, p.name),
              ),
            ),
          ),
          UserDetail.createWithId(
            data.details?.id ?? '',
            data.details?.address ?? '',
            data.details?.phoneNumber ?? '',
            data.details?.profilePictureUrl ?? '',
            data.details?.biography ?? '',
          ),
        ),
      UserOrmEntity,
    );
  }
}
