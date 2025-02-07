// src/features/users/infrastructure/entities/permission.orm-entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { GroupOrmEntity } from './group.orm-entity';

@Entity('permissions') // Nome tabella
export class PermissionOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => GroupOrmEntity, (group) => group.permissions)
  groups!: GroupOrmEntity[];
}
