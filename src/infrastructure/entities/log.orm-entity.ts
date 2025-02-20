import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('logs')
export class LogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  level: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'json', nullable: true })
  context?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
