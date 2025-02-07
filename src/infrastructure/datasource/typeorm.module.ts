// src/infrastructure/datasource/typeorm.module.ts
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import PostGresDataSource from './data-source';

@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          if (!PostGresDataSource.isInitialized) {
            await PostGresDataSource.initialize();
            console.log('✅ Database connected successfully');
          }
          return PostGresDataSource;
        } catch (error) {
          console.error('❌ Error connecting to the database:', error);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmPgModule {}
