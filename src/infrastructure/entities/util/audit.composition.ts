import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class Audit {
  @CreateDateColumn({ type: 'timestamptz', comment: 'Creation date' }) // Usa timestamp con fuso orario
  createdAt!: Date; // Data di creazione

  @UpdateDateColumn({ type: 'timestamptz', comment: 'Last update date' })
  updatedAt!: Date; // Data di ultima modifica

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
    comment: 'Deletion date',
  })
  deletedAt?: Date; // Data di soft delete the entity was soft-deleted (if applicable)
}
