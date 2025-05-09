import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogOrmEntity } from '../entities/log.orm-entity';

@Injectable()
export class LoggerRepository {
  constructor(
    @InjectRepository(LogOrmEntity)
    private readonly logRepository: Repository<LogOrmEntity>,
  ) {}

  async saveLog(level: string, message: string): Promise<void> {
    const log = this.logRepository.create({ level, message });
    await this.logRepository.save(log);
  }
}
