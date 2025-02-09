// src/features/users/infrastructure/entities/permission.orm-entity.ts
import { Entity, Column, ManyToMany } from 'typeorm';
import { GroupOrmEntity } from './group.orm-entity';
import { BaseOrmEntity } from '@shared/infrastructure/entities/base.orm';

@Entity('permissions') // Nome tabella
export class PermissionOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => GroupOrmEntity, (group) => group.permissions)
  groups!: GroupOrmEntity[];
}
