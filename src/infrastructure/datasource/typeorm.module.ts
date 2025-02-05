import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import PostGresDataSource from './data-source';

@Module({
  providers: [
    {
      provide: DataSource, // Fornisce il DataSource come provider globale
      useFactory: async () => {
        try {
          const dataSource = PostGresDataSource;
          await dataSource.initialize();
          console.log('-------------------------------------------------');

          console.log('✅ Database connected successfully');
          return dataSource;
        } catch (error) {
          console.error('❌ Error connecting to the database', error);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource], // Esporta il DataSource
})
export class TypeOrmPgModule {}
