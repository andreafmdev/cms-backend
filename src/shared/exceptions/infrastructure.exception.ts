import { BaseException } from '@shared/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';
// THIS EXCEPTION IS USED TO HANDLE INFRASTRUCTURE ERRORS (DATABASE, API, ETC)
export class InfrastructureException extends BaseException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
