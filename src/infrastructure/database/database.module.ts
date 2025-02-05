import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@core/domain/user.entity';
import { Role } from '@core/domain/role.entity';
import { Permission } from '@core/domain/permission.entity';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDevelopment =
          configService.get<string>('NODE_ENVIRONMENT') === 'development';

        console.log('🚀 ConfigService Loaded Values:');
        console.log('DATABASE_HOST:', configService.get<string>('DB_HOST'));
        console.log('DATABASE_PORT:', configService.get<number>('DB_PORT'));
        console.log(
          'DATABASE_USERNAME:',
          configService.get<string>('DB_USERNAME'),
        );
        console.log(
          'DATABASE_PASSWORD:',
          configService.get<string>('DB_PASSWORD'),
        );
        console.log('DATABASE_NAME:', configService.get<string>('DB_NAME'));
        console.log('NODE_ENV:', configService.get<string>('NODE_ENV'));
        console.log(User);
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'password'),
          database: configService.get<string>('DB_NAME', 'my_database'),
          entities: [User, Role, Permission], // Aggiungi tutte le entità del progetto qui
          synchronize: false, // Imposta su `true` solo per sviluppo
          migrationsTableName: 'migrations',

          logging: isDevelopment,
        };
      },
    }),
  ],
  providers: [],
  exports: [TypeOrmModule], // Esporta anche TypeOrmModule
})
export class DatabaseModule {}
