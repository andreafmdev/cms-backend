import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { GroupOrmEntity } from './group.orm-entity';

@Entity('users') // Nome tabella
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToMany(() => GroupOrmEntity, (group) => group.users)
  @JoinTable({ name: 'user_groups' }) // Nome tabella pivot
  groups!: GroupOrmEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
