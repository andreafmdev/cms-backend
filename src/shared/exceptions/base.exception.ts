import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    cause?: unknown,
  ) {
    super(
      {
        statusCode,
        message,
        cause: cause ?? 'No additional information provided',
        timestamp: new Date().toISOString(), // Aggiungi un timestamp per il debug
      },
      statusCode,
    );
  }
}
