import { FastifyRequest } from 'fastify';
import { JwtPayload } from './jwtPayload.type';

export interface RequestWithUser extends FastifyRequest {
  user: JwtPayload;
}
