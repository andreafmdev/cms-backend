import { Module } from '@nestjs/common';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@module/healthCheck/health.module';
import { UsersModule } from '@module/users/users.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENVIRONMENT !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Rende il ConfigModule disponibile ovunque senza doverlo importare
      envFilePath: '.env', // Percorso del file .env (nello stesso livello di app.module.ts)
    }),
    DatabaseModule,
    UsersModule,
    HealthModule,
  ], // Importa DatabaseModule
})
export class AppModule {}
