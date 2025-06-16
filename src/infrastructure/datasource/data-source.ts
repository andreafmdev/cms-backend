//TYPEORM CONFIG
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { SeederOptions } from 'typeorm-extension';
import { ProductEntities } from '@module/productCatalog/infrastructure/datasource/product-data-source';
import ProductCatalogSeeder from '@module/productCatalog/infrastructure/seeders/product-catalog.seeder';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const options: SeederOptions = {
  seeds: [ProductCatalogSeeder], // ✅ Path per i seed
};
dotenv.config();

const PostGresDataSource = new DataSource({
  ...options,
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'my_database',
  // ✅ Percorso corretto per le entità

  entities: [...ProductEntities], // ✅ Carica solo ORM Entities

  // ✅ Percorso corretto per le migrazioni
  migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENVIRONMENT === 'development',
  namingStrategy: new SnakeNamingStrategy(),
});
/*console.log('✅ TypeORM Config:', PostGresDataSource.options);
console.log('✅ Entities Loaded:', PostGresDataSource.options.entities);
console.log('✅ Migrations Loaded:', PostGresDataSource.options.migrations);*/

export default PostGresDataSource;
