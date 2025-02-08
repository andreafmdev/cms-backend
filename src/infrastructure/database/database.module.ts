import { Module } from '@nestjs/common';
import { TypeOrmPgModule } from '@infrastructure/datasource/typeorm.module';
@Module({
  imports: [TypeOrmPgModule],

  exports: [TypeOrmPgModule], // ✅ Esporta anche DataSource
})
export class DatabaseModule {}
