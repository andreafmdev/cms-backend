import { Injectable } from '@nestjs/common';
import { LoggerRepository } from './logger.repository';

@Injectable()
export class LoggerService {
  constructor(private readonly loggerRepository: LoggerRepository) {}

  async log(level: string, message: string, context?: any) {
    //await this.loggerRepository.saveLog(level, message, context);
  }
}
