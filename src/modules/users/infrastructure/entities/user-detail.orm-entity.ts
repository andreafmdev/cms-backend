import { Entity, Column } from 'typeorm';
import { BaseOrmEntity } from '@shared/infrastructure/entities/base.orm';

@Entity('user_details') // Table name
export class UserDetailOrmEntity extends BaseOrmEntity {
  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Column({ nullable: true })
  biography?: string;
}
