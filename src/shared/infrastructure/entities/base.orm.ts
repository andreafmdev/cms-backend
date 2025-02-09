import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date; // Timestamp for when the entity was created

  @UpdateDateColumn()
  updatedAt!: Date; // Timestamp for the last update of the entity

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date; // Timestamp for when the entity was soft-deleted (if applicable)

  @Column({ nullable: true })
  createdBy?: string; // Stores the ID or username of the user who created the entity

  @Column({ nullable: true })
  updatedBy?: string; // Stores the ID or username of the user who last updated the entity

  @Column({ nullable: true })
  deletedBy?: string; // Stores the ID or username of the user who deleted the entity
}
