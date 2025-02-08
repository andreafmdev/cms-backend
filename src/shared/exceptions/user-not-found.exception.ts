// src/domain/exceptions/user-not-found.exception.ts
import { DomainException } from '@shared/exceptions/domain.exception';
import { ErrorMessages } from '@shared/messages/error-messages';

export class UserNotFoundException extends DomainException {
  constructor() {
    super(ErrorMessages.USER_NOT_FOUND);
  }
}
