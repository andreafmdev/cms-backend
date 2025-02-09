import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export abstract class BaseOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') // UUID generated by typeorm
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' }) // Usa timestamp con fuso orario
  createdAt!: Date; // Data di creazione

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date; // Data di ultima modifica

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date; // Data di soft delete the entity was soft-deleted (if applicable)
  @Column({ type: 'uuid', nullable: true })
  createdBy?: string; // UUID dell'utente che ha creato l'entità

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string; // UUID dell'utente che ha modificato l'entità

  @Column({ type: 'uuid', nullable: true })
  deletedBy?: string; // UUID dell'utente che ha eliminato l'entità (soft delete)
}
