import { Module } from '@nestjs/common';
import { TypeOrmPgModule } from '@base/infrastructure/database/typeorm.module';
@Module({
  imports: [TypeOrmPgModule],

  exports: [TypeOrmPgModule], // ✅ Esporta anche DataSource
})
export class DatabaseModule {}
