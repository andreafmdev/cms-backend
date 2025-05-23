//TYPEORM CONFIG
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { UserOrmEntity } from '@module/users/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@module/users/infrastructure/entities/group.orm-entity';
import { PermissionOrmEntity } from '@module/users/infrastructure/entities/permission.orm-entity';
import { SeederOptions } from 'typeorm-extension';
import UserSeeder from '@userModule/infrastructure/seeds/user.seed';
import UserDetailFactory from '@userModule/infrastructure/factories/user-details.factory';
import { UserDetailOrmEntity } from '@module/users/infrastructure/entities/user-detail.orm-entity';
import { ProductEntities } from '@module/productCatalog/infrastructure/datasource/product-data-source';
import ProductCatalogSeeder from '@module/productCatalog/infrastructure/seeders/product-catalog.seeder';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const options: SeederOptions = {
  seeds: [UserSeeder, ProductCatalogSeeder], // ✅ Path per i seed
  factories: [UserDetailFactory], // ✅ Path per le factory
};
dotenv.config();
const UserEntities = [
  UserOrmEntity,
  UserDetailOrmEntity,
  GroupOrmEntity,
  PermissionOrmEntity,
];

const PostGresDataSource = new DataSource({
  ...options,
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'my_database',
  // ✅ Percorso corretto per le entità

  entities: [...UserEntities, ...ProductEntities], // ✅ Carica solo ORM Entities

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
