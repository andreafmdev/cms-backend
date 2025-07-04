import { Module } from '@nestjs/common';
import { DatabaseModule } from '@base/infrastructure/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from '@module/healthCheck/health.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';
//import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { ProductModule } from '@module/productCatalog/product.module';
import {
  KeycloakConnectModule,
  AuthGuard,
  //RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

const GlobalFilterProvider = {
  provide: APP_FILTER,
  useClass: GlobalExceptionFilter,
};
@Module({
  imports: [
    CqrsModule,
    /*PrometheusModule.register({
      // Indica il percorso in cui saranno esposte le metriche
      path: '/metrics',

      // Etichette di default per identificare la tua applicazione
      defaultLabels: {
        app: 'cms-backend',
      },

      // Configurazione delle metriche predefinite
      defaultMetrics: {
        enabled: true,
        config: {
          // Opzionali: configurazioni per prom-client (es. timeout, prefix, ecc.)
        },
      },

      // (Opzionale) Configurazione del Pushgateway
      // pushgateway: { url: 'http://127.0.0.1:9091' },
    }),*/
    DevtoolsModule.register({
      http: process.env.NODE_ENVIRONMENT !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Rende il ConfigModule disponibile ovunque senza doverlo importare
      envFilePath: '.env', // Percorso del file .env (nello stesso livello di app.module.ts)
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('LOG_LEVEL') || 'debug',
          transport:
            process.env.NODE_ENV !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined, // In produzione disattiva pretty-print per log più performanti
        },
      }),
      inject: [ConfigService],
    }),
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      secret: process.env.KEYCLOAK_SECRET || '',
    }),
    DatabaseModule,
    //UserModule,
    HealthModule,
    ProductModule,
  ], // Importa DatabaseModule
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    /*{
      provide: APP_GUARD,
      useClass: RoleGuard,
    },*/
    CommandBus,
    GlobalFilterProvider,
  ],
})
export class AppModule {
  constructor() {}
}
