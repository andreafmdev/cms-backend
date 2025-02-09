import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('groups') // Table name for groups
export class GroupOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number; // Unique identifier for the group

  @Column({ unique: true })
  name!: string; // Name of the group (must be unique)

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToMany(() => UserOrmEntity, (user) => user.groups)
  users!: UserOrmEntity[]; // Users associated with this group

  @ManyToMany(() => PermissionOrmEntity, (permission) => permission.groups, {
    cascade: true, // Automatically propagate changes to related permissions
  })
  @JoinTable({ name: 'group_permissions' }) // Join table for group-permission relationships
  permissions!: PermissionOrmEntity[]; // Permissions associated with this group
}
