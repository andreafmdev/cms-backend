import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';
import { Column } from 'typeorm';

@Entity('languages')
export class LanguageOrmEntity extends BaseEntity {
  @PrimaryColumn({ type: 'char', length: 2 })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;
}
