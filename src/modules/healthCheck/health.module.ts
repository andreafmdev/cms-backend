import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from '@base/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
})
export class HealthModule {}
