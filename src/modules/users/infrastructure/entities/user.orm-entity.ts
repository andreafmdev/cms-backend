import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { GroupOrmEntity } from './group.orm-entity';
import * as bcrypt from 'bcrypt';
import { BaseOrmEntity } from '@base/infrastructure/entities/base.orm';
import { UserDetailOrmEntity } from './user-detail.orm-entity';
@Entity('users') // Table name
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ManyToMany(() => GroupOrmEntity, (group) => group.users, {
    eager: true,
  })
  @JoinTable({ name: 'user_groups' }) // Join table for user-group relationships
  groups!: GroupOrmEntity[];

  @OneToOne(() => UserDetailOrmEntity, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'details_id' }) // Nome della colonna FK in `users`
  details?: UserDetailOrmEntity;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  lastLogin?: Date;

  // Automatically hashes the password before inserting or updating
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Compares a plain text password with the hashed password
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
