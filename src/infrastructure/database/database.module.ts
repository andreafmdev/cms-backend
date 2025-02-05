import { Module } from '@nestjs/common';
import { TypeOrmPgModule } from '@infrastructure/datasource/typeorm.module';
@Module({
  imports: [TypeOrmPgModule],
  exports: [TypeOrmPgModule], // Esporta il modulo TypeORM per altri moduli
})
export class DatabaseModule {}
