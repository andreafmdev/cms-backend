//this file implements the jwt authentication guard , so it's used to check if the user is authenticated by checking jwt parameters
//it check if the token is valid and if the user is authenticated
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { RequestWithUser } from '../types/requestWithUser';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context);
    try {
      // Log della richiesta di accesso protetto
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const token = this.extractJwtFromRequest(request);
      if (!token) {
        throw new UnauthorizedException('Missing token');
      }
      this.getGuardLogger().debug(
        `JWT Auth attempt 1: ${request.method} ${request.url}`,
      );
      return result as boolean;
    } catch (error) {
      this.logger.error('JWT Auth failed', error);
      throw error;
    }
  }

  private extractJwtFromRequest(request: FastifyRequest): string | null {
    // Fastify mantiene i headers nello stesso formato di Express
    const authHeader = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7);
  }
  protected getGuardLogger(): Logger {
    return new Logger(JwtAuthGuard.name);
  }
}
