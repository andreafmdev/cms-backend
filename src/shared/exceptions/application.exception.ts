import { BaseException } from '@shared/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ApplicationException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
