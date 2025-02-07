// src/features/users/infrastructure/entities/group.orm-entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('groups') // Nome tabella
export class GroupOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => UserOrmEntity, (user) => user.groups)
  users!: UserOrmEntity[];

  @ManyToMany(() => PermissionOrmEntity, (permission) => permission.groups, {
    cascade: true,
  })
  @JoinTable({ name: 'group_permissions' }) // Nome tabella pivot
  permissions!: PermissionOrmEntity[];
}
