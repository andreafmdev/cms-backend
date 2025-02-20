import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogOrmEntity } from '../entities/log.orm-entity';
import { LoggerService } from './logger.service';
import { LoggerRepository } from './logger.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LogOrmEntity])],
  providers: [LoggerService, LoggerRepository],
  exports: [LoggerService], // Per utilizzarlo ovunque
})
export class LogModule {}
