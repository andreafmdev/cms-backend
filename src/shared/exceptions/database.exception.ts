// src/shared/exceptions/database.exception.ts
import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class DatabaseException extends BaseException {
  constructor(message = 'Database error', cause?: unknown) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, cause);
  }
}
