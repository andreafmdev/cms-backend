import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const PostGresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'my_database',
  // ✅ Percorso corretto per le entità
  entities: [path.join(__dirname, '../../core/domain/**/*.entity.{ts,js}')],

  // ✅ Percorso corretto per le migrazioni
  migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
console.log('✅ TypeORM Config:', PostGresDataSource.options);
console.log('✅ Entities Loaded:', PostGresDataSource.options.entities);
console.log('✅ Migrations Loaded:', PostGresDataSource.options.migrations);

export default PostGresDataSource;
