// src/infrastructure/datasource/typeorm.module.ts
import { Module, Global } from '@nestjs/common';
import { DataSource } from 'typeorm';
import PostGresDataSource from '../datasource/data-source';
@Global()
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
          throw new Error('❌ Unable to initialize database connection');
        }
      },
    },
  ],
  exports: [DataSource],
})
export class TypeOrmPgModule {}
