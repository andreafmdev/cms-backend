import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { DomainError } from '@shared/domain/errors/domain-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const timestamp = new Date().toISOString();
    const path = request.url;

    let status: number;
    let message: string;
    let error: string;
    let code: string | undefined;

    if (exception instanceof DomainError) {
      // ✅ All domain errors → 500 for now
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      error = exception.name;
      code = exception.code;

      // ✅ Log as domain error (not as critical error)
      this.logger.warn(
        `Domain Error [${exception.name}]: ${exception.message}`,
        {
          code,
          path,
          timestamp,
          note: 'Domain error temporarily mapped to 500 - will be refined later',
        },
      );
    } else if (exception instanceof HttpException) {
      // ✅ HTTP Exceptions keep their status
      status = exception.getStatus();
      const responseData = exception.getResponse();
      message =
        typeof responseData === 'string'
          ? responseData
          : (responseData as { message: string }).message;
      error = exception.constructor.name;
    } else {
      // ✅ Generic errors → 500
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'InternalServerError';

      this.logger.error(
        `Internal Error: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
        (exception as Error)?.stack,
      );
    }

    const responseBody = {
      statusCode: status,
      timestamp,
      path,
      error,
      message,
      ...(code && { code }), // ✅ Il code c'è sempre per i domain errors
    };

    httpAdapter.reply(response, responseBody, status);
  }

  // ✅ TODO: Implementare mapping intelligente più tardi
  // private mapDomainErrorToHttpStatus(error: DomainError): number {
  //   // Implementation coming later...
  // }
}
