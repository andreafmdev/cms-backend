import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { PermissionOrmEntity } from './permission.orm-entity';
import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';

@Entity('groups') // Table name for groups
export class GroupOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  name!: string; // Name of the group (must be unique)

  @ManyToMany(() => UserOrmEntity, (user) => user.groups)
  users!: UserOrmEntity[]; // Users associated with this group

  @ManyToMany(() => PermissionOrmEntity, (permission) => permission.groups, {
    cascade: true, // Automatically propagate changes to related permissions
    eager: true,
  })
  @JoinTable({ name: 'group_permissions' }) // Join table for group-permission relationships
  permissions!: PermissionOrmEntity[]; // Permissions associated with this group
}
