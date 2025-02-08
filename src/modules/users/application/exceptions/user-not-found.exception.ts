import { ApplicationException } from '@shared/exceptions/application.exception';

export class UserNotFoundException extends ApplicationException {
  constructor() {
    super('User not found');
  }
}
