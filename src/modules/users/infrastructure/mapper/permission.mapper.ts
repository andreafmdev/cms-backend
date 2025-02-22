import { Injectable } from '@nestjs/common';
import { Permission } from '@module/users/domain/entities/permission';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';

@Injectable()
export class PermissionMapper {
  /**
   * Mappa un'entity ORM in una entity di dominio
   */
  toDomain(ormEntity: PermissionOrmEntity): Permission {
    return Permission.create(ormEntity.name);
  }

  /**
   * Mappa una entity di dominio in un'entity ORM per il salvataggio
   */
  toPersistence(domainEntity: Permission): PermissionOrmEntity {
    const orm = new PermissionOrmEntity();
    orm.name = domainEntity.getName();
    return orm;
  }
}
