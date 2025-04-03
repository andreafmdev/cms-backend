import { Injectable } from '@nestjs/common';
import { PermissionMapper } from './permission.mapper';
import { Group } from '@module/users/domain/aggretates/group';
import { GroupOrmEntity } from '@module/users/infrastructure/entities/group.orm-entity';
import { GroupId } from '@module/users/domain/value-objects/group-id.vo';
import { Permission } from '@module/users/domain/entities/permission';

@Injectable()
export class GroupMapper {
  constructor(private readonly permissionMapper: PermissionMapper) {}

  /**
   * Mappa un'entity ORM in una entity di dominio
   */
  toDomain(orm: GroupOrmEntity): Group {
    const groupId: GroupId = GroupId.create(orm.id);
    const permissionsList: Permission[] = orm.permissions.map((p) =>
      this.permissionMapper.toDomain(p),
    );

    return Group.reconstitute(groupId, orm.name, permissionsList);
  }

  /**
   * Mappa una entity di dominio in un'entity ORM per il salvataggio
   */
  toPersistence(domainEntity: Group): GroupOrmEntity {
    const orm = new GroupOrmEntity();
    orm.id = domainEntity.getId()!.toString();
    orm.name = domainEntity.getName();
    orm.permissions = domainEntity
      .getPermissions()
      .map((p) => this.permissionMapper.toPersistence(p));
    return orm;
  }
}
