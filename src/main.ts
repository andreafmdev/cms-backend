import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import { LoggerMiddleware } from '@shared/middleware/logger.middleware';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  // ✅ Fastify adapter registration
  await app.register(cors);
  await app.register(helmet);
  // ✅ Use global filters for handiling exceptions

  // ✅ Implementa il middleware correttamente per Fastify
  app.useLogger(app.get(Logger));
  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onRequest', async (req, res) => {
      const logger = new LoggerMiddleware();
      logger.use(req, res, () => {});
    });
  await app.init();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap().catch((error) => {
  console.error('❌ Error during bootstrap:', error);
});
