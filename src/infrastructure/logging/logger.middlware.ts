import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void): void {
    const startTime = Date.now();
    res.raw.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { method, url } = req;
      const statusCode = res.statusCode;
      const logMessage = `${method} ${url} ${statusCode} - ${responseTime}ms`;

      const level =
        statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

      req.log[level](logMessage);
    });

    next();
  }
}
