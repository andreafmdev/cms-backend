import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
//import { LoggerMiddleware } from '@shared/middleware/logger.middleware';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //  Use FastifyAdapter
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: false },
  );

  // ✅ Fastify adapter registration
  await app.register(cors, {
    origin: [process.env.CORS_ORIGIN || '*', process.env.CORS_ORIGIN_UI || '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true, // Importante se usi cookie
  });
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  await app.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
      files: 3, // For multipart forms, the max number of parts (fields + files)
    },
  });

  // ✅ Use global filters for handiling exceptions

  // ✅ Implementa il middleware correttamente per Fastify
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  /* app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', async (req, res) => {
      const logger = new LoggerMiddleware();
      logger.use(req, res, () => {});
    })*/

  //#region swagger
  const config = new DocumentBuilder()
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .addBearerAuth()
    .setTitle('Tamagni Piano Store')
    .setDescription('This is the API for the Tamagni Piano Store')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //#endregion

  await app.init();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap().catch((error) => {
  console.error('❌ Error during bootstrap:', error);
});
