import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const responseObj = exception.getResponse();

    const message =
      typeof responseObj === 'string'
        ? responseObj
        : (responseObj as { message: string }).message;

    console.error(`[Exception] ${exception.constructor.name}: ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      error: exception.constructor.name,
    });
  }
}
