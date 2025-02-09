import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply<any>, next: () => void): void {
    console.log(`Request... ${req.method} ${req.url}`);
    next();
  }
}
